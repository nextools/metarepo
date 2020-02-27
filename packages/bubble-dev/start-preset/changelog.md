## v1.3.3

* 🐞 recreate symlinks instead of hard-copying during the `pkg` task

## v1.3.2

* 🐞 propagate <package path> argument to `pkg` task

## v1.3.1

* 🐞 make Sandbox task for web quiet by default

## v1.3.0

* 🌱 add `Pkg` task factory

  ```
  a task to copy package templates and replace special placeholders, see local ./tasks for live example
  ```

* 🐞 show and run only tasks with `/^[a-z]/` names

## v1.2.4

* 🐞 switch from deprecated `request` to `node-fetch` dependency

  ```
  >As of Feb 11th 2020, request is fully deprecated. No new changes are expected to land. In fact, none have landed for some time.
  
  https://github.com/request/request/issues/3142
  ```

## v1.2.3

* 🐞 remove unnecessary peer deps

* 🐞 fix missing deps

## v1.2.2

* 🐞 fix building packages with CLI

## v1.2.1

* 🐞 format `fixDeps` task report

## v1.2.0

* 🌱 add `checkDeps` task

* 🐞 bump dockerized Chromium to v79

## v1.1.1

* 🐞 enhance `fixDeps` task reports

* 🐞 fix deps

## v1.1.0

* 🐞 refactor using shared Babel config

* ♻️ update dependencies: `@bubble-dev/babel-config`

## v1.0.2

* 🐞 add ability to fix deps of a single package

* 🐞 add `react-native-view-shot` dependency

## v1.0.1

* 🐞 bump `react-native-svg` to v11

* 🐞 bump compatible deps

## v1.0.0

* 💥 drop Node.js v8 support and require >=10.13.0 (first v10 LTS)

* 🌱 add `CheckChromePerfSnapshots` task factory

* 🐞 use workspaces to find files to fixLint

* 🐞 use workspaces to find files to lint

* ♻️ update dependencies: `bro-resolve`, `@x-ray/chrome-perf-snapshots`, `@x-ray/chrome-screenshots`, `@x-ray/firefox-screenshots`, `@x-ray/snapshots`, `@start/plugin-lib-codecov`, `@rebox/android`, `@rebox/ios`, `copie`, `@start/plugin-copy`, `dleet`, `@start/plugin-remove`, `fixdeps`, `move-path`, `@start/plugin-write`, `@auto/start-plugin`, `@auto/log`, `@auto/npm`, `@auto/fs`, `pifs`, `@start/plugin-overwrite`, `@start/plugin-read`, `@x-ray/native-screenshots`, `@x-ray/screenshot-utils`, `@x-ray/web-mobile-screenshots`, `@x-ray/native-screenshots-app`, `@x-ray/web-mobile-screenshots-app`, `rn-resolve`, `@x-ray/common-utils`, `tsfn`, `@rebox/web`, `@start/plugin-lib-istanbul`, `typeon`, `@auto/bump`, `@auto/git`, `@auto/utils`, `@bubble-dev/browsers-list`, `@start/plugin`, `@start/plugin-env`, `@start/plugin-find`, `@start/plugin-lib-babel`, `@start/plugin-lib-eslint`, `@start/plugin-lib-tape`, `@start/plugin-lib-typescript-check`, `@start/plugin-lib-typescript-generate`, `@start/plugin-parallel`, `@start/plugin-rename`, `@start/plugin-sequence`, `@start/reporter-verbose`

## v0.23.0

* ♻️ update dependencies: `@auto/start-plugin`, `@auto/git`, `@auto/log`, `@auto/bump`, `@auto/npm`, `@auto/fs`, `@auto/utils`

## v0.22.0

* 🐞 fix `react-native-svg` dependency owner
* ♻️ update dependencies: `@start/plugin-lib-istanbul`

## v0.21.0

* 🐞 bump `metro-react-native-babel-preset`
* ♻️ update dependencies: `@rebox/android`, `@rebox/ios`

## v0.20.0

* ♻️ update dependencies: `@x-ray/chrome-screenshots`, `@x-ray/firefox-screenshots`, `@x-ray/snapshots`, `@x-ray/native-screenshots-app`

## v0.19.0

* ♻️ update dependencies: `@x-ray/native-screenshots-app`, `@x-ray/chrome-screenshots`, `@x-ray/firefox-screenshots`, `@x-ray/snapshots`

## v0.18.0

* ♻️ update dependencies: `@x-ray/chrome-screenshots`, `@x-ray/firefox-screenshots`, `@x-ray/snapshots`

## v0.17.1

* 🐞 make all `should` Start Auto options explicitly `false` by default

## v0.17.0

* 🌱 support Optional Chaining and Nullish Coalescing ES features
* ♻️ update dependencies: `@rebox/ios`, `@rebox/android`, `@rebox/web`, `@x-ray/chrome-screenshots`, `@x-ray/firefox-screenshots`, `@x-ray/snapshots`, `@x-ray/screenshot-utils`, `@x-ray/native-screenshots`, `@x-ray/web-mobile-screenshots`

## v0.16.0

* ♻️ update dependencies: `@x-ray/chrome-screenshots`, `@x-ray/firefox-screenshots`, `@x-ray/snapshots`

## v0.15.1

* 🐞 upgrade `execa` to v3

## v0.15.0

* 🌱 handle custom fonts for "mobile web" screenshots
* ♻️ update dependencies: `@x-ray/web-mobile-screenshots-app`, `@x-ray/web-mobile-screenshots`

## v0.14.0

* 🌱 send message to Telegram in `publish` task with `shouldSendTelegramMessage` option
* ♻️ update dependencies: `@auto/start-plugin`, `@auto/log`

## v0.13.0

* 🌱 add `CheckIosScreenshots` and `CheckAndroidScreenshots` task factories
* 🐞 reanimate `buildSandbox` task
* ♻️ update dependencies: `@x-ray/web-mobile-screenshots`, `@x-ray/web-mobile-screenshots-app`

## v0.12.0

* 🌱 add `sandbox` support

## v0.11.2

* 🐞 fix globs for `lint` and `fix` tasks

## v0.11.1

* 🐞 log progress from `rebox`

## v0.11.0

* 💥 update react-native v0.60
* 🐞 bump react-native
* ♻️ update dependencies: `@rebox/android`, `@rebox/ios`

## v0.10.2

* 🐞 fix missed dependency

## v0.10.1

* 🐞 ignore `@babel-runtime` by default

## v0.10.0

* 🌱 handle fixdeps options per package
* ♻️ update dependencies: `fixdeps`

## v0.9.2

* 🐞 handle `*-meta` files in `fixDeps` task

## v0.9.1

* 🐞 update Firefox to v68
* 🐞 update Chromium to v76
* 🐞 refactor using latest babel/preset-env

## v0.9.0

* 🌱 add x-ray tasks
* 🌱 add `removeYarnCache` plugin to `testPublish` task
* 🌱 add `testPublish` task with local Verdaccio NPM registry
* 🌱 add `buildTasks` feature
* 🐞 add 	`entryPointField` to x-ray tests
* 🐞 fix mocks resolve
* 🐞 disable Babel `transform-regenerator` and `transform-async-to-generator` for build tasks
* 🐞 lint x-ray folder
* ♻️ update dependencies: `@x-ray/firefox-screenshots`, `@x-ray/chrome-screenshots`, `@x-ray/screenshot-utils`, `@x-ray/native-screenshots`, `@x-ray/snapshots`, `@x-ray/common-utils`, `@rebox/web`, `bro-resolve`, `@rebox/android`, `@rebox/ios`, `rn-link`, `rn-resolve`, `fixdeps`, `tsfn`, `@start/plugin-lib-istanbul`

## v0.8.0

* 🐞 add bigint support
* ♻️ update dependencies: `@start/plugin-lib-eslint`

## v0.7.3

* 🐞 skip `fixtures/` folder in `test` task

## v0.7.2

* 🐞 cleanup and fix deps

## v0.7.1

* 🐞 bump `auto`

## v0.7.0

* 🌱 add `access` to npm config
* ♻️ upgrade dependencies: `@auto/start-plugin`, `@auto/npm`

## v0.6.2

* 🐞 pass NPM options for publishing to Start config

## v0.6.1

* 🐞 include only `readme.md` and `license.md` files when publishing

## v0.6.0

* 💥 move all GitHub and Slack options to env vars
* 🌱 add `shouldWriteChangelogFiles` option to publish task
* ♻️ upgrade dependencies: `@auto/start-plugin`, `@auto/log`, `@auto/bump`, `@auto/git`, `@auto/npm`, `@auto/utils`
