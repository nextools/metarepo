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
