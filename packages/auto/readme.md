# auto

Set of helpers for managing and developing (mono)repos.

## Overview

Let's say that there is the following monorepo structure using [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/):

```
packages/
├── foo/
├── bar/
└── baz/
```

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

By running the following code there will be actions made automatically:

* get workspaces packages
* parse Git commits and collect all the necessary "bumps" for certain packages, including:
  * patch for `@scope/baz`: `0.1.1`
  * minor for `@scope/bar`: `0.2.0`
  * minor for `@scope/foo` because of dependency on `@scope/bar`: `0.2.0`
  * dependency range update of `@scope/bar` for `@scope/foo`
  * dev dependency range update of `@scope/baz` for `@scope/foo`
* for each affected package:
  * write dependencies bumps to `package.json` file
  * make dependencies commit
  * write bumped version to `package.json` file
  * make bumped version commit
  * make bumped version tag
  * publish to NPM
* push commits and tags
* make GitHub release with markdown for each published package

```js
(async () => {
  const { getWorkspacesPackages } = await import('@auto/fs')
  const { getWorkspacesBumps, pushCommitsAndTags } = await import('@auto/git')
  const { getWorkspacesPackagesBumps } = await import('@auto/bump')
  const { writePackageDependencies, writeWorkspacesPackageVersion } = await import('@auto/fs')
  const { writeWorkspacesDependenciesCommit, writeWorkspacesPublishCommit, writeWorkspacesPublishTag } = await import('@auto/git')
  const { getWorkspacesLog, makeWorkspacesGithubReleases } = await import('@auto/log')

  const prefixes = {
    required: {
      major: { title: 'Breaking change', value: '💥' },
      minor: { title: 'New feature', value: '🌱' },
      patch: { title: 'Bugfix', value: '🐞' },
      publish: { title: 'New version', value: '📦' },
      dependencies: { title: 'Dependencies', value: '♻️' },
      initial: { title: 'Initial', value: '🐣' }
    },
    custom: [
      { title: 'Docs', value: '📝' },
      { title: 'Refactor', value: '🛠' },
      { title: 'WIP', value: '🚧' }
    ]
  }
  const bumpOptions = { zeroBreakingChangeType: 'minor' }
  const workspacesOptions = { autoNamePrefix: '@scope/' }
  const gitOptions = { initialType: 'minor' }
  const githubOptions = {
    username: 'username',
    repo: 'repo',
    token: process.env.MY_GITHUB_RELEASES_TOKEN
  }

  const packages = await getWorkspacesPackages(workspacesOptions)
  const gitBumps = await getWorkspacesBumps(packages, prefixes, gitOptions)
  const packagesBumps = await getWorkspacesPackagesBumps(packages, gitBumps, bumpOptions, workspacesOptions)
  const logs = getWorkspacesLog(packagesBumps, gitBumps)

  for (const bump of packagesBumps) {
    console.log(`${bump.name}:`)

    await writePackageDependencies(bump, workspacesOptions)
    console.log('write package dependencies')

    await writeWorkspacesDependenciesCommit(bump, prefixes)
    console.log('write dependencies commit')

    await writeWorkspacesPackageVersion(bump)
    console.log('write package version')

    await writeWorkspacesPublishCommit(bump, prefixes)
    console.log('write publish commit')

    await writeWorkspacesPublishTag(bump)
    console.log('write publish tag')

    await publishWorkspacesPackage(bump)
    console.log('publish to NPM')
  }

  await pushCommitsAndTags()
  await makeWorkspacesGithubReleases(logs, prefixes, githubOptions)
})()
```
