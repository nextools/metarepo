# auto

Set of helpers for monorepos based on [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) to automate:

* customizable conventional Git commits
* interactive CLI prompt to make commits and publish packages
* managing cross-dependencies and syncing semver version ranges across the monorepo
* building and preparing packages
* making Git tags
* making GitHub Releases
* publishing to NPM
* creating and updating `changelog.md`
* sending messages to Slack
* sending messages to Telegram
* …any other feature that one can easily implement

TOC:

* [Conventional Git commits](#conventional-git-commits)
* [Config](#config)
  * [`prefixes`](#prefixes)
  * [`bump`](#bump)
  * [`npm`](#npm)
* [Hooks](#hooks)
* [Core API](#core-api)
  * [`auto`](#auto-1)
  * [`writeDependenciesCommit`](#writedependenciescommit)
  * [`writePublishCommit`](#writepublishcommit)
  * [`publishPackages`](#publishpackages)
  * [`writePublishTags`](#writepublishtags)
  * [`pushCommitsAndTags`](#pushcommitsandtags)
* [Prompt](#prompt)
* [Example](#example) 
* [Additional functionality](#additional-functionality)
    * [`@auto/commit-prompt`](#autocommit-prompt)
    * [`@auto/tag`](#autotag)
    * [`@auto/github`](#autogithub)
    * [`@auto/changelog`](#autochangelog)
    * [`@auto/slack`](#autoslack)
    * [`@auto/telegram`](#autotelegram)

## Conventional Git commits

`auto` parses Git log to get the data about the package releases. Suchwise Git commit has to have a certain shape:

```
<prefix> <packageName>[, <packageName>]: commit message
```

Where:

* `prefix` – any arbitrary string one would like to use as a marker of particular change type, for example `🐞` for bugfix or just `[fix]`
* `packageName` – one or many package names (separated with `, ` delimiter) affected by the change in this commit; `@`-symbol for NPM scoped packages should be omitted

Examples:

```
🐞 foo, bar: fix issue
```

```
[feat] scope/baz: add feature
```

```
[boom] foo: breaking changes
```

## Config

`auto` stores its config in the root `package.json` of the monorepo under the `auto` key. 

### `prefixes`

The following prefixes are _required_, although one can defined any other ones:

```json
{
  "auto": {
    "prefixes": {
      "major": "💥",
      "minor": "🌱",
      "patch": "🐞",
      "initial": "🐣",
      "dependencies": "♻️",
      "publish": "📦"
    }
  }
}
```

* `major` – prefix for a commit that contains breaking changes, according to [semver](https://semver.org/)
* `minor` – … new feature, according to [semver](https://semver.org/)
* `patch` – … bugfix, according to [semver](https://semver.org/)
* `initial` – … new package initialization: it must be `0.0.0` version in its own `package.json` and `^0.0.0` range in its dependents `package.json`
* `dependencies` – … package dependents semver range updates, `auto` uses this prefix automatically
* `publish` – … package release version update, `auto` uses this prefix automatically

As mentioned earlier, emojis are being used here only as an example, it's free to use any strings

### `bump`

General config to tweak `auto` behavior:

```json
{
  "auto": {
    "bump": {
      "shouldAlwaysBumpDependents": false,
    }
  }
}
```

Where:

* `shouldAlwaysBumpDependents` – `false` by default – makes package to always update dependents' version ranges and bump dependents, even if version range of a certain dependent satisfies package new release version; useful for monorepos where one would like to always expclicitly propagate and publish every patch and feature across all the packages

It's possible to override any `bump` options in particular `package.json` allowing some packages to behave differently from the global monorepo config.

### `npm`

Config to control publishing to NPM phase:

```json
{
  "auto": {
    "registry": "https://",
    "publishSubDirectory": "dir",
    "access": "restricted"
  }
}
```

Where:

* `registry` – `https://registry.npmjs.org/` by default – NPM compilant registry URL
* `publishSubDirectory` – is a sub path which will be added to package directory during Publish phase, can be omitted
* `access` – `restricted` by default – NPM [`access`](https://docs.npmjs.com/misc/config#access)

## Hooks

`auto` provides a lot of hooks which are called in particular order during the process. These hooks can be used to either prevent certain phases, or to do something during them.

Hook is a function with the following signature:

```ts
type THookProps = {
  config: TAutoConfig,
  prefixes: TRequiredPrefixes,
  packages: TPackageRelease[],
}

type THook = (props: THookProps) => Promise<void>
```

Hook gets special props – internal information to work with – and should return a promise. `auto` will wait for the promise to resolve and then continue further through the hooks flow. If promise rejects then `auto` stops the whole process to avoid any further wrong steps such as incorrent Git commits or even NPM publish.

The following hooks are supported:

```ts
type THooks = {
  preDepsCommit?: THook | false,
  depsCommit?: THook | false,
  postDepsCommit?: THook | false,
  prePublishCommit?: THook | false,
  publishCommit?: THook | false,
  postPublishCommit?: THook | false,
  preBuild?: THook | false,
  build?: THook | false,
  postBuild?: THook | false,
  prePublish?: THook | false,
  publish?: THook | false,
  postPublish?: THook | false,
  prePush?: THook | false,
  push?: THook | false,
  postPush?: THook | false,
}
```

* each phase has its main, `pre` and `post` hook
* if phase's main hook is not provided, `auto` will make default actions except the build phase, which is purely user responsibility
* to completely skip certain phase, including default behavior, provide `false` value as a phase's main hook
* `depsCommit` and `publishCommit` add all modified/deleted files (`git add -u`) to the commit, and it's possible to use `pre` hooks to modify and/or stage more files which will be commited during the main phase

## Core API

`@auto/core` entrypoint exports the following functions:

```ts
import {
  auto,
  writeDependenciesCommit,
  writePublishCommit,
  publishPackages,
  pushCommitsAndTags,
} from '@auto/core'
```

Default usage example would look like the following:

```ts
import { auto } from '@auto/core'

await auto({
  build: ({ packages }) => {
    // build packages
  },
  prePublishCommit: ({ packages }) => {
    // write changelogs
    // files will be commited during publishCommit phase
  },
  prePublish: ({ packages }) => {
    // prepare packages to be published
  },
  prePush: ({ packages }) => {
    // make git tags
    // tags will be pushed during push phase
  },
  postPush: ({ packages }) => {
    // make Github releases
    // publish message to Slack
  }
})
```

Or some kind of a "test" publish, for example to a local [Verdaccio](https://github.com/verdaccio/verdaccio) NPM registry:

```js
import { auto, publishPackages } from '@auto/core'

await auto({
  // don't make deps commit
  depsCommit: false,    
  // don't make publish commit
  publishCommit: false, 
  // don't push to remote
  push: false,          
  build: ({ packages }) => {
    // build your packages
  },
  prepublish: ({ packages }) => {
    // prepare packages to publish
  },
  // override main `publish` hook
  publish: publishPackages({
    registry: 'http://localhost:4873',
  })
})
```

### `auto`

Main function which it iterates over hooks.

```ts
const auto: (hooks: TAutoHooks): Promise<void>
```

### `writeDependenciesCommit`

Hook factory that writes dependencies commit, assigned to `depsCommit` hook by default.

```ts
const writeDependenciesCommit: () => THook
```

### `writePublishCommit`

Hook factory that writes publish commit, assigned to `publishCommit` hook by default.

```ts
const writePublishCommit: () => THook
```

### `publishPackages`

Hook factory that publishes to NPM, assigned to `publish` hook by default.

```ts
const publishPackages: (publishConfig: {
  registry?: string,
  onError?: (e: Error) => void
}) => THook
```

### `pushCommitsAndTags`

Hook factory that pushes Git commits and tags, assigned to `push` hook by default.

```ts
const publishPackages: () => THook
```

## Prompt

`auto` interactively prompts user to approve/discard all the changes which are about to happen.

It has several options:

### `yes`

Proceed with the current changes, everything looks good.

### `no`

Abort current state and go back to the terminal. The intention of using `no` answer could be to go back to Git and manually rebase some commit messages, for example something is being "minor" by mistake but should become a "patch".

### `edit`

In some advanced cases user might want to manually tweak some of the _proposed_ by `auto` changes. `edit` answer will open a special temp file in default editor, just like `git commit` does, and `auto` will wait for it to be closed. After that there will be another prompt with a possibility to `yes`/`no`/`edit` again (and again).

That special temp file contains JSON with the following keys:

#### `dependencyBumps`

How bump of some dependency affects its dependents. For example, if dependency `foo` got majorly bumped, from `1.0.0` to `2.0.0` and there are dependents with `"foo": "^1.0.0"` in their `package.json` then auto will _propose_ to majorly bump such dependents as well. In reality it's quite a wide guess and should be considered only as a default behavior and therefore carefully verified. One might already handled a situation like the above by making sure that dependents have a necessary patch because `foo` didn't actually break anything for them.

User can only _delete_ entries, any other editing will be ignored.

#### `initialTypes`

Similar opinionated situation as with `dependencyBumps` – `auto` proposes to bump an initial `0.0.0` to `0.1.0` to start with. It's possible to change type of the initial bump to `patch | minor | major`.

Any other editing such as deleting lines will be ignored.

####  `zeroBreakingTypes`

According to semver version `0.2.0` does _not_ satisfy a `^0.1.0` range, because "major zero" is a special case. By default `auto` proposes to bump `0.1.0` to `0.2.0` if there was a major bump somewhere in Git commits. It's possible to change that type to `patch | minor | major`, for example as if one want to jump from `0.1.0` to `1.0.0`.

Any other editing such as deleting lines will be ignored.

## Example

Let's say there is the following monorepo structure:

```
packages/
├── foo/
├── bar/
└── baz/
```

With such a root `package.json` config for `auto`:

```json
{
  "workspaces": {
    "packages/*"
  },
  "auto": {
    "prefixes": {
      "major": "💥",
      "minor": "🌱",
      "patch": "🐞",
      "publish": "📦",
      "dependencies": "♻️",
      "initial": "🐣"
    },
    "bump": {
      "shouldAlwaysBumpDependents": false, 
    }
  }
}
```

And such packages dependency tree:

```json
{
  "name": "@scope/foo",
  "version": "0.1.0",
  "dependencies": {
    "@scope/bar": "^0.1.0"
  },
  "devDependencies": {
    "@scope/baz": "^0.1.0"
  }
}
```

```json
{
  "name": "@scope/bar",
  "version": "0.1.0"
}
```

```json
{
  "name": "@scope/baz",
  "version": "0.1.0"
}
```

And the following Git commits:

```
🌱 bar: some feature
🐞 baz: some fix
```

And `auto` API has been invoked in all-defaults mode:

```ts
import { auto } from '@auto/core'

await auto()
```

`auto` will:

* gather workspace packages
* parse Git commits and collect all the necessary "bumps" for certain packages, including:
  * patch for `@scope/baz`: `0.1.1`
  * minor for `@scope/bar`: `0.2.0`
  * minor for `@scope/foo` because of dependency on `@scope/bar`: `0.2.0`
  * dependency range update of `@scope/bar` for `@scope/foo`, from `^0.1.0` to `^0.2.0`
  * dev dependency range update of `@scope/baz` for `@scope/foo`, from `^0.1.0` to `^0.1.1`
* interactively prompt to approve/discard all the above information
* for each affected package:
  * write new dependency ranges to `package.json` file
  * make `♻️ upgrade dependencies` Git commit
  * write bumped version to `package.json` file
  * make `📦 scope/foo, scope/bar, scope/baz: release` Git commit
  * publish `@scope/foo`, `@scope/bar` and `@scope/baz` to NPM
  * Git push everything

## Additional functionality

`@auto` NPM scope also contains some additional packages:

### `@auto/commit-prompt`

Interactive prompt to make commits using `prefixes` defined in `auto` config.

```ts
const makeCommit: () => Promise<void>
```

### `@auto/tag`

Hook to make per-release Git tags.

```ts
const writePublishTags: THook
```

### `@auto/github`

Hook factory to make [GitHub releases](https://help.github.com/en/github/administering-a-repository/about-releases) with necessary changelog.

```ts
type TGithubConfig = {
  token: string,
  username: string,
  repo: string,
}

const makeGithubReleases: (githubConfig: TGithubConfig) => THook
```

### `@auto/changelog`

Hook factory to create and update per-package `changelog.md` file with necessary changes.

```ts
const writeChangelogFiles: THook
```

### `@auto/slack`

Hook factory send [Slack](https://slack.com/) message with necessary changelog.

```ts
type TSlackConfig = {
  token: string,
  channel: string,
  username: string,
  iconEmoji: string,
  colors: {
    [k in 'major' | 'minor' | 'patch' | 'initial']: string
  },
}

const sendSlackMessage: (slackConfig: TSlackConfig) => THook
```

### `@auto/telegram`

Hook factory to send [Telegram](https://telegram.org/) message with necessary changelog.

```ts
type TTelegramConfig = {
  token: string,
  chatId: string,
}

const sendTelegramMessage: (telegramConfig: TTelegramConfig) => THook
```
