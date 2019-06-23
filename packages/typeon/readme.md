# typeon

Typed JSON parse and stringify for TypeScript.

* no `any`
* no additional arguments for `parse` and `stringify`

## Install

```sh
yarn add --dev typeon
```

## Usage

```ts
import {
  jsonParse,
  jsonStringify,
  TJsonValue,
  TJsonMap,
  TJsonArray
} from 'typeon'

const json = jsonParse('{"a":{"b":["c"]}}') // TJsonMap
const str = jsonStringify({ a: { b: ['c'] } }) // string

const jsonValueString: TJsonValue = 'a' // ok
const jsonValueNumber: TJsonValue = 1 // ok
const jsonValueBoolean: TJsonValue = true // ok
const jsonValueNull: TJsonValue = null // ok
const jsonValueObject: TJsonValue = {} // ok
const jsonValueArray: TJsonValue = [] // ok
const jsonValueUndefined: TJsonValue = undefined // error
const jsonValueFunction: TJsonValue = () => {} // error
const jsonValueRegexp: TJsonValue = /^.$/ // error
// …

const jsonMap: TJsonMap = { a: true } // ok
const jsonMapWithFunction: TJsonMap = { a: () => {} } // error
// …

const jsonArray: TJsonArray = [1] // ok
const jsonArrayWithFunction: TJsonArray = [() => {}] // error
// …
```
