# ida ![npm](https://flat.badgen.net/npm/v/ida)

Iterable data structures.

## Install

```sh
$ yarn add ida
```

## API

### `Map`

Wrapper on top of native ES6 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

#### `from`

Converts iterable into Map.

```ts
static from<K, V>(source: Iterable<readonly [K, V]>): TMap<K, V>
```

```ts
import { Map } from 'ida'

const map = Map.from([
  ['a', 1],
  ['b', 2]
])

console.log(map.get('a'))
// 1
```

#### `fromAsync`

Converts async iterable into Map.

```ts
static fromAsync<K, V>(source: AsyncIterable<readonly [K, V]>): Promise<TMap<K, V>>
```

```ts
import { Map } from 'ida'

const asyncIterable = {
  *[symbol.asyncIterable]() {
    yield Promise.resolve(['a', 1])
    yield Promise.resolve(['b', 2])
  }
}
const map = await Map.fromAsync(asyncIterable)

console.log(map.get('a'))
// 1
```

#### `size`

Returns Map size.

```ts
get size(): number
```

```ts
import { Map } from 'ida'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

console.log(map.size)
// 2
```

#### `clear`

Clears Map entries.

```ts
clear(): this
```

```ts
import { Map } from 'ida'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

map.clear()

console.log(map.size)
// 0
```

#### `delete`

Deletes Map entry by key.

```ts
delete(key: K): this
```

```ts
import { Map } from 'ida'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

map.delete('a')

console.log(map.get('a'))
// undefined
```

#### `has`

Checks if Map has a key.

```ts
has(key: K): boolean
```

```ts
import { Map } from 'ida'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

console.log(map.has('a'))
// true
```

#### `get`

Returns Map value by key.

```ts
get(key: K): V | undefined
get(key: K, fallbackValue: V): V
```

```ts
import { Map } from 'ida'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

console.log(map.get('c'))
// undefined

console.log(map.get('c', 3))
// 3
```

#### `set`

Sets value for key.

```ts
set(key: K, value: V): this
```

```ts
import { Map } from 'ida'

const map = new Map()

map.set('a', 1)

console.log(map.has('a'))
// true
```

#### `update`

Updates value in Map by key.

```ts
update(key: K, updateFn: (value?: V) => V): this
update(key: K, updateFn: (value: V) => V, fallbackValue: V): this
```

```ts
import { Map } from 'ida'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

map.update('a', (value) => value + 10)

console.log(map.get('a'))
// 11

map.update('c', (value) => value + 10, 3)

console.log(map.get('c'))
// 13
```

#### `keys`

Returns Map keys wrapped into Ida `Set`.

```ts
keys(): TSet<K>
```

```ts
import { Map } from 'ida'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

console.log(map.keys().toArray())
// ['a', 'b']
```

#### `values`

Returns Map values wrapped into Ida `Set`.

```ts
values(): TSet<V>
```

```ts
import { Map } from 'ida'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

console.log(map.values().toArray())
// [1, 2]
```

#### `pipe`

Pipes Map entries into new Map.

```ts
pipe(): TMap<K, V>
pipe<K0, V0, K1, V1>(fn0: (arg: Iterable<readonly [K0, V0]>) => Iterable<readonly [K1, V1]>): TMap<K1, V1>
// up to 8 functions
```

```ts
import { Map } from 'ida'
import { filter, map } from 'iterama'

const origMap = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3]
])

const filterFn = (([key]: readonly [string, number]) => key !== 'c')
const mapFn = (([key, value]: readonly [string, number]) => [key, value + 10] as const)

const newMap = origMap.pipe(
  filter(filterFn),
  map(mapFn)
)

console.log(newMap.get('a'))
// 11

console.log(newMap.get('b'))
// 12

console.log(newMap.get('c'))
// undefined
```

#### `toObject`

Converts Map info Object (explicitly stringifying keys).

```ts
toObject(): { [key: string]: V }
```

```ts
import { Map } from 'ida'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

console.log(map.toObject())
// { a: 1, b: 2 }
```

#### `toNativeMap`

Converts Ida Map into native ES6 Map.

```ts
toNativeMap(): Map<K, V>
```

```ts
import { Map } from 'ida'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

console.log(map.toNativeMap())
// Map { a → 1, b → 2 }
```

### `Set`

Wrapper on top of native ES6 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) collection.

#### `from`

Converts iterable into Set.

```ts
static from<T>(source: Iterable<T>): TSet<T>
```

```ts
import { Set } from 'ida'

const set = Set.from(['a', 'b'])

console.log(set.has('a'))
// true
```

#### `fromAsync`

Converts async iterable into Set.

```ts
static fromAsync<T>(source: AsyncIterable<T>): Promise<TSet<T>>
```

```ts
import { Set } from 'ida'

const asyncIterable = {
  *[symbol.asyncIterable]() {
    yield Promise.resolve('a')
    yield Promise.resolve('b')
  }
}
const set = await Set.fromAsync(asyncIterable)

console.log(set.has('a'))
// true
```

#### `size`

Returns Set size.

```ts
get size(): number
```

```ts
import { Set } from 'ida'

const set = new Set(['a', 'b'])

console.log(set.size)
// 2
```

#### `clear`

Clears Set values.

```ts
clear(): this
```

```ts
import { Set } from 'ida'

const set = new Set(['a', 'b'])

set.clear()

console.log(set.size)
// 0
```

#### `delete`

Deletes Set value.

```ts
delete(value: T): this
```

```ts
import { Set } from 'ida'

const set = new Set(['a', 'b'])

set.delete('a')

console.log(set.has('a'))
// false
```

#### `has`

Checks if Set has a value.


```ts
has(value: T): boolean
```

```ts
import { Set } from 'ida'

const set = new Set(['a', 'b'])

console.log(set.has('a'))
// true
```

#### `add`

Adds a value to Set.

```ts
add(value: T): this
```

```ts
import { Set } from 'ida'

const set = new Set()

set.add('a')

console.log(set.had('a'))
// true
```

#### `pipe`

Pipes Set values into new Set.

```ts
pipe(): TSet<T>;
pipe<T0, T1>(fn0: (arg: Iterable<T0>) => Iterable<T1>): TSet<T1>
// up to 8 functions
```

```ts
import { Set } from 'ida'
import { filter, map } from 'iterama'

const origSet = new Set(['a', 'b', 'c'])

const filterFn = ((value: string) => value !== 'c')
const mapFn = ((value: string) => `${value}${value}`)

const newSet = origSet.pipe(
  filter(filterFn),
  map(mapFn)
)

console.log(newSet.toArray())
// [ "a", "b" ]
```

#### `toArray`

Converts Set info Array.

```ts
toArray(): T[]
```

```ts
import { Set } from 'ida'

const set = new Set(['a', 'b', 'c'])

console.log(set.toArray())
// ["a", "b", "c"]
```

#### `toNativeSet`

Converts Ida Set into native ES6 Map.

```ts
toNativeSet(): Set<T>
```

```ts
import { Set } from 'ida'

const set = new Set(['a', 'b', 'c'])

console.log(set)
// Set [ "a", "b", "c" ]
```
