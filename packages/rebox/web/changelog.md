## v5.0.0

* 💥 switch to new React JSX transform

* 💥 switch to React v17

## v4.0.0

* 💥 use built-in `core-js` version in `buildWebAppRelease`

  ```
  Breaking change because `core-js` and its version is out of control from user land perspective from now on. Which is good for `rebox` purposes, no need to install `core-js` anymore on project level.
  ```

* 💥 switch to `babel-plugin-polyfill-corejs3` with browsers list in `buildWebAppRelease`

  ```
  Theoretically a breaking change.
  
  * https://babeljs.io/blog/2020/05/25/7.10.0#new-experimental-polyfills-architecture-10008httpsgithubcombabelbabelissues10008-babel-polyfillshttpsgithubcombabelbabel-polyfills
  * https://github.com/babel/babel-polyfills
  * https://github.com/babel/babel-polyfills/blob/main/docs/migration.md
  ```

## v3.2.1

* 🐞 update `loader-utils` to v2

## v3.2.0

* 🌱 allow to pass `props` to React app from Node.js side

## v3.1.0

* 🌱 add `raw-loader` for `txt` and `md`

## v3.0.0

* 💥 drop Node.js v10

* ♻️ update dependencies `tsfn`

## v2.1.10

* 🐞 upgrade Terser Webpack Plugin to v4

## v2.1.9

* 🐞 fix watching entire project

## v2.1.8

* 🐞 bump React

## v2.1.7

* 🐞 upgrade `terser-webpack-plugin` to v3

## v2.1.6

* 🐞 use alternative plugin to inline runtime chunk in `buildWebAppRelease`

## v2.1.5

* 🐞 support `.web.jsx` extension

## v2.1.4

* 🐞 upgrade html-webpack-plugin to v4

* 🐞 upgrade file-loader to v6

## v2.1.3

* 🐞 fix missing `.js` and `.jsx` extensions

## v2.1.2

* 🐞 workaround for Nullish Coalescing and Optional Chaining

## v2.1.1

* 🐞 workaround for Nullish Coalescing and Optional Chaining

## v2.1.0

* 🌱 use built-in Babel config and expose `browsersList` option

## v2.0.1

* 🐞 add package description and keywords

* 🐞 add readme

## v2.0.0

* 💥 change API

* 🐞 sync React Native and React versions

* ♻️ update dependencies `@nextools/babel-config`

## v1.1.2

* 🐞 rethink peer deps and fix missing deps

## v1.1.1

* 🐞 print errors even with `isQuiet: true` option in `buildRelease()`

* 🐞 properly throw errors in `buildRelease()`

## v1.1.0

* 🐞 refactor using shared Babel config

## v1.0.1

* 🐞 bump compatible deps

## v1.0.0

* 💥 drop Node.js v8 support and require >=12.13.0 (first v10 LTS)

* 🌱 add `globalAliases` option to `buildRelease`

* 🌱 add `globalConstants` option to `buildRelease`

* 🌱 add `shouldGenerateBundleAnalyzerReport` option to `buildRelease`

* 🌱 add `shouldGenerateSourceMaps` option to `buildRelease`

* 🌱 add `isQuiet` option to `buildRelease`

* 🐞 fix `NODE_ENV=production` in `buildRelease`

* ♻️ update dependencies: `tsfn`

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
