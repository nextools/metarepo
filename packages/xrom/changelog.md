## v3.0.2

* 🐞 refactor using new deps

## v3.0.1

* 🐞 🐞 refactor using new deps

* ♻️ update dependencies `tsfn`

## v3.0.0

* 💥 drop Node.js v10

* ♻️ update dependencies `tsfn`

## v2.0.1

* 🐞 add `--shm-size=1g` to fix "Out of memory. size=262144" error

  ```
  already existing `--disable-dev-shm-usage` Chromium flag doesn't help
  ```

## v2.0.0

* 💥 rename export function to `runBrowser` and make it run Chromium or Firefox

## v1.0.4

* 🐞 handle Docker errors more properly

## v1.0.3

* 🐞 switch from deprecated `request` to `node-fetch` dependency

  ```
  >As of Feb 11th 2020, request is fully deprecated. No new changes are expected to land. In fact, none have landed for some time.
  
  https://github.com/request/request/issues/3142
  ```

## v1.0.2

* 🐞 fix deps

## v1.0.1

* 🐞 bump dockerized Chromium to v79

## v1.0.0

* 🐣 init
