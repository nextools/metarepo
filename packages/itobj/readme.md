# itobj ![npm](https://flat.badgen.net/npm/v/itobj)

Iterate Object.

⚠️ Ignores any keys but strings in types and skips Symbols and stringifies the rest of the keys in runtime just like Object methods do.

## Install

```sh
$ yarn add itobj
```

## Usage

```ts
type TStringKey<T> = keyof T & string

const iterateObjectKeys: <T extends {}>(obj: T) => Iterable<TStringKey<T>>
const iterateObjectValues: <T extends {}>(obj: T) => Iterable<T[TStringKey<T>]>
const iterateObjectEntries: <T extends {}>(obj: T) => Iterable<[TStringKey<T>, T[TStringKey<T>]]>
```

```ts
import { iterateObjectKeys, iterateObjectValues, iterateObjectEntries } from 'itobj'

const obj = { a: 1, b: 2, c: 3 }

for (const key of iterateObjectKeys(obj)) {
  console.log(key)
}
// 'a'
// 'b'
// 'c'

for (const value of iterateObjectValues(obj)) {
  console.log(value)
}
// 1
// 2
// 3

for (const entry of iterateObjectEntries(obj)) {
  console.log(entry)
}
// ['a', 1]
// ['b', 2]
// ['c', 3]
```
