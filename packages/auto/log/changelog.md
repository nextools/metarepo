## v1.0.2

* 🐞 switch from deprecated `request` to `node-fetch` dependency

  ```
  >As of Feb 11th 2020, request is fully deprecated. No new changes are expected to land. In fact, none have landed for some time.
  
  https://github.com/request/request/issues/3142
  ```

## v1.0.1

* 🐞 fix generating `changelog.md` with Git commmit descriptions

  ```
  paragraph 1 line 1
  paragraph 1 line 2
  
  paragraph 2 line 1
  paragraph 2 line 2
  ```

## v1.0.0

* 💥 drop Node.js v8 support and require >=10.13.0 (first v10 LTS)

* ♻️ update dependencies: `pifs`, `tsfn`, `@auto/utils`

## v0.5.0

* 🌱 parse git commit descriptions and use it in changelog

* ♻️ update dependencies: `@auto/utils`

## v0.4.1

* 🐞 fix errors handling in `sendTelegramMessage`

## v0.4.0

* 🌱 add `sendTelegramMessage` method

## v0.3.2

* 🐞 skip other messages on initial bump

## v0.3.1

* 🐞 remove bump type from changelog

## v0.3.0

* 💥 remove all "repo" methods
* 🌱 list packages in "update dependencies" message
* 🌱 add `writeWorkspacesChangelogFiles`
* ♻️ upgrade dependencies: `@auto/utils`
