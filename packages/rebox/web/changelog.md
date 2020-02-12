## v1.1.2

* 🐞 rethink peer deps and fix missing deps

## v1.1.1

* 🐞 print errors even with `isQuiet: true` option in `buildRelease()`

* 🐞 properly throw errors in `buildRelease()`

## v1.1.0

* 🐞 refactor using shared Babel config

* ♻️ update dependencies: `@bubble-dev/babel-config`

## v1.0.1

* 🐞 bump compatible deps

## v1.0.0

* 💥 drop Node.js v8 support and require >=10.13.0 (first v10 LTS)

* 🌱 add `globalAliases` option to `buildRelease`

* 🌱 add `globalConstants` option to `buildRelease`

* 🌱 add `shouldGenerateBundleAnalyzerReport` option to `buildRelease`

* 🌱 add `shouldGenerateSourceMaps` option to `buildRelease`

* 🌱 add `isQuiet` option to `buildRelease`

* 🐞 fix `NODE_ENV=production` in `buildRelease`

* ♻️ update dependencies: `tsfn`, `@bubble-dev/browsers-list`

## v0.5.0

* 🌱 support Optional Chaining and Nullish Coalescing ES features

## v0.4.5

* 🐞 fix too many extracted comments in `buildRelease`

## v0.4.4

* 🐞 re-enable `minimize` option for `buildRelease`
* 🐞 bring back `isQuiet` option to `run()`

## v0.4.3

* 🐞 handle more image types

## v0.4.2

* 🐞 remove `isQuiet` option

## v0.4.1

* 🐞 update `terser-webpack-plugin` to v2

## v0.4.0

* 💥 refactor
* 🐞 handle images and videos
* ♻️ update dependencies: `tsfn`

## v0.3.4

* 🐞 add babel plugin bigint to dependencies

## v0.3.3

* 🐞 add bigint support

## v0.3.2

* 🐞 re-enable minimize for `buildWeb`

## v0.3.1

* 🐞 fix images and videos loader

## v0.3.0

* 🌱 handle PNG and MP4 files
