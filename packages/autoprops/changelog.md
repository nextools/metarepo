## v3.0.2

* 🐞 upgrade `iterama`

* ♻️ update dependencies `iterama`

## v3.0.1

* 🐞 fix inner children restriction

## v3.0.0

* 💥 use `HEX` format for `id` hash in `mapPropsIterable`

  ```
  instead of base64 to avoid `/` symbols
  ```

## v2.0.1

* 🐞 fix deps and required case

## v2.0.0

* 💥 refactor

  ```
  * add special handling for `children` in `required`
  * add `deps` feature
  * remove `mutin` feature
  * change `required` field to allow all prop keys
  ```

## v1.0.4

* 🐞 upgrade `iterama`

* ♻️ update dependencies `iterama`

## v1.0.3

* 🐞 fix recursive meta type

* ♻️ update dependencies `tsfn`

## v1.0.2

* 🐞 upgrade jsSHA to v3

## v1.0.1

* 🐞 re-publish using updated Start preset

* ♻️ update dependencies `tsfn`

## v1.0.0

* 💥 drop Node.js v8 support and require >=10.13.0 (first v10 LTS)

* ♻️ update dependencies: `tsfn`

## v0.7.1

* 🐞 fix serialize symbol

## v0.7.0

* 💥 change meta shape

## v0.6.8

* 🐞 enhance meta types

## v0.6.6

* 🐞 allow children keys in props mutexes

## v0.6.5

* 🐞 sort props keys

## v0.6.4

* 🐞 optimize `packPerm`

## v0.6.3

* 🐞 fix `getNumSkipMutin` for `children` word

## v0.6.2

* 🐞 cleanup `TComponentConfig` type
* 🐞 handle `children` key in mutex and mutin groups
* 🐞 fix index offset
* 🐞 enhance `serializeProps`

## v0.6.1

* 🐞 enhance types

## v0.6.0

* 🐞 skip mutins
* 🐞 add `getNumPerms`
* 🐞 fix child index offset in `getNextPerm`
* 🐞 add `id` field to props generator
* ♻️ update dependencies: `tsfn`

## v0.5.2

* 🐞 add BigInt polyfill

## v0.5.1

* 🐞 add get-props-iterable

## v0.5.0

* 💥 refactor props generator

## v0.4.3

* 🐞 remove `refun` dependency

## v0.4.2

* 🐞 fix autoprops mutex skip behavior

## v0.4.1

* 🐞 add skip mutexes ability
