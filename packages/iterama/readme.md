# iterama ![npm](https://flat.badgen.net/npm/v/iterama)

Composable functional (async) iterable helpers.

## Install

```sh
yarn add iterama
```

## API

* [`concat`](#concat)
* [`concatAsync`](#concatasync)
* [`distinct`](#distinct)
* [`distinctAsync`](#distinctasync)
* [`filter`](#filter)
* [`filterAsync`](#filterasync)
* [`forEach`](#foreach)
* [`forEachAsync`](#foreachasync)
* [`iterate`](#iterate)
* [`iterateAsync`](#iterateasync)
* [`length`](#length)
* [`lengthAsync`](#lengthasync)
* [`map`](#map)
* [`mapAsync`](#mapasync)
* [`range`](#range)
* [`rangeAsync`](#rangeasync)
* [`reduce`](#reduce)
* [`reduceAsync`](#reduceasync)
* [`scan`](#scan)
* [`scanAsync`](#scanasync)
* [`skip`](#skip)
* [`skipAsync`](#skipasync)
* [`slice`](#slice)
* [`sliceAsync`](#sliceasync)
* [`startWith`](#startwith)
* [`startWithAsync`](#startwithasync)
* [`take`](#take)
* [`takeAsync`](#takeasync)
* [`unique`](#unique)
* [`uniqueAsync`](#uniqueasync)
* [`zip`](#zip)
* [`zipAsync`](#zipasync)
* [`toArray`](#toarray)
* [`toArrayAsync`](#toarrayasync)
* [`toSet`](#toset)
* [`toSetAsync`](#tosetasync)
* [`toObject`](#toobject)
* [`toObjectAsync`](#toobjectasync)
* [`toMap`](#tomap)
* [`toMapAsync`](#tomapasync)

In the examples below we use `range()` and `rangeAsync()` helpers whenever possible just to save space and reading time.

`range(5)` is the same as `[0, 1, 2, 3, 4]` array (because arrays are iterables too), or, in a more low-level manner:

```ts
{
  *[Symbol.iterator]() {
    for (let i = 0; i < 5; i++) {
      yield i
    }
  }
}
```

and `rangeAsync(5)` is:

```ts
{
  async *[Symbol.asyncIterator]() {
    for (let i = 0; i < 5; i++) {
      yield await Promise.resolve(i)
    }
  }
}
```

### `concat`

Concatenates multiple iterables. 

```ts
const concat: <T>(...iterables: Iterable<T>[]) => Iterable<T>
```

```ts
import { concat } from 'iterama'

const iterable1 = [1, 2, 3]
const iterable2 = [4, 5, 6]
const result = concat(iterable1, iterable2)

for (const value of result)
  console.log(value)
}
// 1
// 2
// 3
// 4
// 5
// 6
```

### `concatAsync`

Concatenates multiple async iterables. 

```ts
const concatAsync: <T>(...iterables: AsyncIterable<T>[]) => AsyncIterable<T>
```

```ts
import { concatAsync } from 'iterama'

const iterable1 = {
  async *[Symbol.asyncIterable]() {
    for (let i = 1; i <= 3; i++) {
      yield await Promise.resolve(i)
    }
  }
}
const iterable2 = {
  async *[Symbol.asyncIterable]() {
    for (let i = 4; i <= 6; i++) {
      yield await Promise.resolve(i)
    }
  }
}
const result = concatAsync(iterable1, iterable2)

for await (const value of result)
  console.log(value)
}
// 1
// 2
// 3
// 4
// 5
// 6
```

### `distinct`

Distincts (squashes repeatable) iterable values.

```ts
const distinct: <T>(iterable: Iterable<T>) => Iterable<T>
```

```ts
import { distinct } from 'iterama'

const result = distinct([1, 1, 3, 3, 4, 3])

for (const value of result) {
  console.log(value)
}
// 1
// 3
// 4
// 3

```
### `distinctAsync`

Distincts (squashes repeatable) async iterable values.

```ts
const distinctAsync: <T>(iterable: AsyncIterable<T>) => AsyncIterable<T>
```

```ts
import { distinctAsync } from 'iterama'

const iterable = {
  async *[Symbol.asyncIterable]() {
    yield await Promise.resolve(1)
    yield await Promise.resolve(1)
    yield await Promise.resolve(3)
    yield await Promise.resolve(3)
    yield await Promise.resolve(4)
    yield await Promise.resolve(3)
  }
}
const result = distinctAsync(iterable)

for await (const value of result) {
  console.log(value)
}
// 1
// 3
// 4
// 3
```

### `filter`

Filters iterable values.

```ts
type TFilterFn<T> = (arg: T, index: number) => boolean

const filter: <T>(filterFn: TFilterFn<T>) => (iterable: Iterable<T>) => Iterable<T>
```

```ts
import { filter, range } from 'iterama'

const iterable = range(5)
const isEven = (x: number) => x % 2 === 0
const result = filter(isEven)(iterable)

for (const value of result) {
  console.log(value)
}
// 0
// 2
// 4
```

### `filterAsync`

Filters async iterable values.

```ts
type TFilterFnAsync<T> = (arg: T, index: number) => Promise<boolean> | boolean

const filterAsync: <T>(filterFn: TFilterFnAsync<T>) => (iterable: AsyncIterable<T>) => AsyncIterable<T>
```

```ts
import { filterAsync, rangeAsync } from 'iterama'

const iterable = rangeAsync(5)
const isEven = (x: number) => x % 2 === 0
const result = filterAsync(isEven)(iterable)

for await (const value of result) {
  console.log(value)
}
// 0
// 2
// 4
```

### `forEach`

Invokes callback with iterable values.

```ts
type TForEachFn<T> = (value: T, i: number) => void

const forEach: <T>(forEachFn: TForEachFn<T>) => (iterable: Iterable<T>) => Iterable<T>
```

```ts
import { forEach, range } from 'iterama'

const iterable = range(5)
const result = forEach(console.log)(iterable)

for (const value of result) {
  console.log(value)
}
// 0 0
// 0
// 1 1
// 1
// 2 2
// 2
// 3 3
// 3
// 4 4
// 4
```

### `forEachAsync`

Invokes callback with async iterable values.

```ts
type TForEachFnAsync<T> = (value: T, i: number) => Promise<void> | void

const forEachAsync: <T>(forEachFn: TForEachFnAsync<T>) => (iterable: AsyncIterable<T>) => AsyncIterable<T>
```

```ts
import { forEachAsync, rangeAsync } from 'iterama'

const iterable = rangeAsync(5)
const result = forEachAsync(async (value, i) => {
  await Promise.resolve()

  console.log(value, i)
})(iterable)

for await (const value of result) {
  console.log(value)
}
// 0 0
// 0
// 1 1
// 1
// 2 2
// 2
// 3 3
// 3
// 4 4
// 4
```

### `iterate`

Provides iterable iterator out of iterable.

```ts
const iterate: <T>(iterable: Iterable<T>): IterableIterator<T>
```

```ts
import { iterate, range } from 'iterama'

const iterable = range(5)
const iterator = iterate(iterable)

console.log(iterator.next().value)
// 0
console.log(iterator.next().value)
// 1

for (const value of iterator) {
  console.log(value)
}
// 2
// 3
// 4
```

### `iterateAsync`

Provides async iterable iterator out of async iterable.

```ts
const iterateAsync: <T>(iterable: AsyncIterable<T>): AsyncIterableIterator<T>
```

```ts
import { iterateAsync, rangeAsync } from 'iterama'

const iterable = rangeAsync(5)
const iterator = iterateAsync(iterable)

console.log((await iterator.next()).value)
// 0
console.log((await iterator.next()).value)
// 1

for await (const value of iterator) {
  console.log(value)
}
// 2
// 3
// 4
```

### `length`

Returns length of iterable, limited to `Number.MAX_SAFE_INTEGER`.

```ts
const length: <T>(iterable: Iterable<T>) => number
```

```ts
import { length, range } from 'iterama'

const iterable = range(5)
const result = length(iterable)

console.log(result)
// 5
```

### `lengthAsync`

Returns length of async iterable, limited to `Number.MAX_SAFE_INTEGER`.

```ts
const lengthAsync: <T>(iterable: AsyncIterable<T>) => Promise<number>
```

```ts
import { lengthAsync, rangeAsync } from 'iterama'

const iterable = rangeAsync(5)
const result = await lengthAsync(iterable)

console.log(result)
// 5
```

### `map`

Maps over iterable.

```ts
type TMapFn<T, R> = (value: T, i: number) => R

const map: <T, R>(mapFn: TMapFn<T, R>) => (iterable: Iterable<T>) => Iterable<R>
```

```ts
import { map } from 'iterama'

const iterable = range(5)
const mult2 = (x: number) => x * 2
const result = map(mult2)(iterable)
 
for (const value of result) {
  console.log(value)
}
// 0
// 2
// 4
// 6
// 8
```

### `mapAsync`

Maps over async iterable.

```ts
type TMapFnAsync<T, R> = (value: T, i: number) => Promise<R> | R

const mapAsync: <T, R>(mapFn: TMapFnAsync<T, R>) => (iterable: AsyncIterable<T>) => AsyncIterable<R>
```

```ts
import { mapAsync, rangeAsync } from 'iterama'

const iterable = rangeAsync(5)
const mult2 = (x: number) => Promise.resolve(x * 2)
const result = mapAsync(mult2)(iterable)
 
for await (const value of result) {
  console.log(value)
}
// 0
// 2
// 4
// 6
// 8
```

### `range`

Provides iterable filled with numbers from zero to given length.

```ts
const range: (length: number) => Iterable<number>
```

```ts
import { range } from 'iterama'

const result = range(5)

for (const value of result) {
  console.log(value)
}
// 0
// 1
// 2
// 3
// 4
```

### `rangeAsync`

Provides async iterable filled with numbers from zero to given length.

```ts
const rangeAsync: (length: number) => AsyncIterable<number>
```

```ts
import { rangeAsync } from 'iterama'

const result = rangeAsync(5)

for await (const value of result) {
  console.log(value)
}
// 0
// 1
// 2
// 3
// 4
```

### `reduce`

Reduces over iterable.

```ts
type TReduceFn<T, R> = (acc: R, value: T, index: number) => R

const reduce: <T, R>(reduceFn: TReduceFn<T, R>, initial: R) => (iterable: Iterable<T>) => Iterable<R>
```

```ts
import { reduce, range } from 'iterama'

const iterable = range(5)
const reducer = (acc: number, value: number) => acc + value
const result = reduce(reducer, 0)(iterable)

for (const value of result) {
  console.log(value)
}
// 10
```

### `reduceAsync`

Reduces over async iterable.

```ts
type TReduceFnAsync<T, R> = (acc: R, value: T, index: number) => Promise<R> | R

const reduceAsync: <T, R>(reduceFn: TReduceFnAsync<T, R>, initial: Promise<R> | R) => (iterable: AsyncIterable<T>) => Promise<R>
```

```ts
import { reduceAsync, rangeAsync } from 'iterama'

const iterable = rangeAsync(5)
const reducer = (acc: number, value: number) => Promise.resolve(acc + value)
const result = await reduceAsync(reducer, Promise.resolve(0))(iterable)

console.log(result)
// 10
```

### `scan`

Scans over iterable. Like reduce but returns iterable with values from every step.

```ts
type TScanFn<T, R> = (acc: R, value: T, index: number) => R

const scan: <T, R>(scanFn: TScanFn<T, R>, initial: R) => (iterable: Iterable<T>) => Iterable<R>
```

```ts
import { scan } from 'iterama'

const iterable = range(5)
const scanner = (acc: number, value: number) => Promise.resolve(acc + value)
const result = scan(scanner, 0)(iterable)

for (const value of result) {
  console.log(value)
}
// 0
// 1
// 3
// 6
// 10
```

### `scanAsync`

Scans over async iterable. Like reduce but returns async iterable with values from every step.

```ts
type TScanFnAsync<T, R> = (acc: R, value: T, index: number) => Promise<R> | R

const scanAsync: <T, R>(scanFn: TScanFnAsync<T, R>, initial: Promise<R> | R) => (iterable: AsyncIterable<T>) => AsyncIterable<R>
```

```ts
import { scanAsync, rangeAsync } from 'iterama'

const iterable = rangeAsync(5)
const scanner = (acc: number, value: number) => Promise.resolve(acc + value)
const result = scanAsync(scanner, 0)(iterable)

for await (const value of result) {
  console.log(value)
}
// 0
// 1
// 3
// 6
// 10
```

### `skip`

Skips `n` first/last iterable values.

```ts
const skip: (n: number) => <T>(iterable: Iterable<T>) => Iterable<T>
```

```ts
import { skip, range } from 'iterama'

const iterable1 = range(5)
const result1 = skip(2)(iterable1)

for (const value of result1) {
  console.log(value)
}
// 2
// 3
// 4

const iterable2 = range(5)
const result2 = skip(-2)(iterable2)

for (const value of result2) {
  console.log(value)
}
// 0
// 1
// 2

```
### `skipAsync`

Skips `n` first/last async iterable values.

```ts
const skipAsync: (n: number) => <T>(iterable: AsyncIterable<T>) => AsyncIterable<T>
```

```ts
import { skipAsync, rangeAsync } from 'iterama'

const iterable1 = rangeAsync(5)
const result1 = skipAsync(2)(iterable1)

for await (const value of result1) {
  console.log(value)
}
// 2
// 3
// 4

const iterable2 = rangeAsync(5)
const result2 = skipAsync(-2)(iterable2)

for await (const value of result2) {
  console.log(value)
}
// 0
// 1
// 2
```

### `slice`

Slices iterable.

```ts
const slice: (from?: number, to?: number) => <T>(iterable: Iterable<T>) => Iterable<T>
```

```ts
import { slice, range } from 'iterama'

const iterable1 = range(5)
// skip 1, take 2
const result1 = slice(1, 2)(iterable1)

for (const value of result1) {
  console.log(value)
}
// 1
// 2

const iterable2 = range(5)
// skip until 2 from end, take 1
const result2 = slice(-2, 1)(iterable2)

for (const value of result2) {
  console.log(value)
}
// 3

const iterable3 = range(5)
// don't skip, take last 2
const result3 = slice(0, -2)(iterable3)

for (const value of result3) {
  console.log(value)
}
// 0
// 1
// 2

const iterable4 = range(5)
// skip 2, take the rest
const result4 = slice(2)(iterable4)

for (const value of result4) {
  console.log(value)
}
// 2
// 3
// 4

const iterable5 = range(5)
// skip until 2 from end, take the rest
const result5 = slice(-2)(iterable5)

for (const value of result4) {
  console.log(value)
}
// 3
// 4

const iterable6 = range(5)
// don't skip, take all
const result6 = slice()(iterable6)

for (const value of result6) {
  console.log(value)
}
// 0
// 1
// 2
// 3
// 4
```

### `sliceAsync`

Slices async iterable.

```ts
const sliceAsync: (from?: number, to?: number) => <T>(iterable: AsyncIterable<T>) => AsyncIterable<T>
```

```ts
import { sliceAsync, rangeAsync } from 'iterama'

const iterable1 = rangeAsync(5)
// skip 1, take 2
const result1 = sliceAsync(1, 2)(iterable1)

for await (const value of result1) {
  console.log(value)
}
// 1
// 2

const iterable2 = rangeAsync(5)
// skip until 2 from end, take 1
const result2 = sliceAsync(-2, 1)(iterable2)

for await (const value of result2) {
  console.log(value)
}
// 3

const iterable3 = rangeAsync(5)
// don't skip, take last 2
const result3 = sliceAsync(0, -2)(iterable3)

for await (const value of result3) {
  console.log(value)
}
// 0
// 1
// 2

const iterable4 = rangeAsync(5)
// skip 2, take the rest
const result4 = sliceAsync(2)(iterable4)

for await (const value of result4) {
  console.log(value)
}
// 2
// 3
// 4

const iterable5 = rangeAsync(5)
// skip until 2 from end, take the rest
const result5 = sliceAsync(-2)(iterable5)

for await (const value of result4) {
  console.log(value)
}
// 3
// 4

const iterable6 = rangeAsync(5)
// don't skip, take all
const result6 = sliceAsync()(iterable6)

for await (const value of result6) {
  console.log(value)
}
// 0
// 1
// 2
// 3
// 4
```

### `startWith`

Starts iterable with additional value.

```ts
const startWith: <T>(value: T) => (iterable: Iterable<T>) => Iterable<T>
```

```ts
import { startWith, range } from 'iterama'

const iterable = range(5)
const result = startWith(-1)(iterable)

for (const value of result) {
  console.log(value) 
}
// -1
// 0
// 1
// 2
// 3
// 4
```

### `startWithAsync`

Starts async iterable with additional value.

```ts
const startWithAsync: <T>(value: T) => (iterable: AsyncIterable<T>) => AsyncIterable<T>
```

```ts
import { startWithAsync, rangeAsync } from 'iterama'

const iterable = rangeAsync(5)
const result = startWithAsync(-1)(iterable)

for await (const value of result) {
  console.log(value) 
}
// -1
// 0
// 1
// 2
// 3
// 4
```

### `take`

Takes `n` first/last iterable values.

```ts
const take: (n: number) => <T>(iterable: Iterable<T>) => Iterable<T>
```

```ts
import { take, range } from 'iterama'

const iterable1 = range(5)
// take 2 first, skip the rest
const result1 = take(2)(iterable1)

for (const value of result1) {
  console.log(value)
}
// 0
// 1

const iterable2 = range(5)
// take 2 last
const result2 = take(-2)(iterable2)

for (const value of result1) {
  console.log(value)
}
// 3
// 4
```

### `takeAsync`

Takes `n` first/last async iterable values.

```ts
const takeAsync: (n: number) => <T>(iterable: AsyncIterable<T>) => AsyncIterable<T>
```

```ts
import { takeAsync, rangeAsync } from 'iterama'

const iterable1 = rangeAsync(5)
// take 2 first, skip the rest
const result1 = takeAsync(2)(iterable1)

for await (const value of result1) {
  console.log(value)
}
// 0
// 1

const iterable2 = rangeAsync(5)
// take 2 last
const result2 = takeAsync(-2)(iterable2)

for await (const value of result1) {
  console.log(value)
}
// 3
// 4
```

### `unique`

Takes unique iterable values.

```ts
const unique: <T>(iterable: Iterable<T>) => Iterable<T>
```

```ts
import { unique } from 'iterama'

const iterable = {
  *[Symbol.iterator]() {
    yield 1
    yield 1
    yield 3
    yield 4
    yield 3
  }
}
const result = unique(iterable)

for (const value of result) {
  console.log(value)
}
// 1
// 3
// 4
```

### `uniqueAsync`

Takes unique async iterable values.

```ts
const uniqueAsync: <T>(iterable: AsyncIterable<T>) => AsyncIterable<T>
```

```ts
import { uniqueAsync } from 'iterama'

const iterable = {
  async *[Symbol.asyncIterator]() {
    yield await Promise.resolve(1)
    yield await Promise.resolve(1)
    yield await Promise.resolve(3)
    yield await Promise.resolve(4)
    yield await Promise.resolve(4)
  }
}
const result = uniqueAsync(iterable)

for await (const value of result) {
  console.log(value)
}
// 1
// 3
// 4
```

### `zip`

Zips (combines) multiple iterables.

```ts
const zip: <A, B>(iterable0: Iterable<A>, iterable1: Iterable<B>) => Iterable<[A, B]>
const zip: <A, B, C>(iterable0: Iterable<A>, iterable1: Iterable<B>, iterable2: Iterable<C>) => Iterable<[A, B, C]>
const zip: <A, B, C, D>(iterable0: Iterable<A>, iterable1: Iterable<B>, iterable2: Iterable<C>, iterable3: Iterable<D>) => Iterable<[A, B, C, D]>
```

```ts
import { zip, range } from 'iterama'

const iterable1 = range(5)
const iterable2 = {
  *[Symbol.iteratior]() {
    yield 'a'
    yield 'b'
    yield 'c'
    yield 'd'
  }
}
const result = zip(iterable1, iterable2)

for (const value of result) {
  console.log(value)
}

// [0, 'a'],
// [1, 'b'],
// [2, 'c'],
// [3, 'd']
```

### `zipAsync`

Zips (combines) multiple async iterables.

```ts
const zipAsync: <A, B>(iterable0: AsyncIterable<A>, iterable1: AsyncIterable<B>) => AsyncIterable<[A, B]>
const zipAsync: <A, B, C>(iterable0: AsyncIterable<A>, iterable1: AsyncIterable<B>, iterable2: AsyncIterable<C>) => AsyncIterable<[A, B, C]>
const zipAsync: <A, B, C, D>(iterable0: AsyncIterable<A>, iterable1: AsyncIterable<B>, iterable2: AsyncIterable<C>, iterable3: AsyncIterable<D>) => AsyncIterable<[A, B, C, D]>
```

```ts
import { zipAsync, rangeAsync } from 'iterama'

const iterable1 = rangeAsync(5)
const iterable2 = {
  async *[Symbol.asyncIteratior]() {
    yield await Promise.resolve('a')
    yield await Promise.resolve('b')
    yield await Promise.resolve('c')
    yield await Promise.resolve('d')
  }
}
const result = zipAsync(iterable1, iterable2)

for await (const value of result) {
  console.log(value)
}

// [0, 'a'],
// [1, 'b'],
// [2, 'c'],
// [3, 'd']
```

### `toArray`

Convert iterable into array.

```ts
const toArray: <T>(iterable: Iterable<T>) => T[]
```

```ts
import { toArray, range } from 'iterama'

const iterable = range(5)
const result = toArray(iterable)

console.log(result)
// [0, 1, 2, 3, 4]
```

### `toArrayAsync`

Convert async iterable into array.

```ts
const toArrayAsync: <T>(iterable: AsyncIterable<T>) => Promise<T[]>
```

```ts
import { toArrayAsync, rangeAsync } from 'iterama'

const iterable = rangeAsync(5)
const result = await toArrayAsync(iterable)

console.log(result)
// [0, 1, 2, 3, 4]
```

### `toSet`

Convert iterable into Set.

```ts
const toSet: <T>(iterable: Iterable<T>) => Set<T>
```

```ts
import { toSet, range } from 'iterama'

const iterable = range(5)
const result = toSet(iterable)

console.log(result)
// Set(5) [ 0, 1, 2, 3, 4 ]
```

### `toSetAsync`

Convert async iterable into Set.

```ts
const toSetAsync: <T>(iterable: AsyncIterable<T>) => Promise<Set<T>>
```

```ts
import { toSetAsync, rangeAsync } from 'iterama'

const iterable = rangeAsync(5)
const result = await toSetAsync(iterable)

console.log(result)
// Set(5) [ 0, 1, 2, 3, 4 ]
```

### `toObject`

Convert iterable filled with entries into object.

```ts
const toObject: <K extends PropertyKey, V>(iterable: Iterable<readonly [K, V]>) => { [key in K]: V }
```

```ts
import { toObject } from 'iterama'

const iterable = {
  *[Symbol.iterator]() {
    yield ['a', 0]
    yield ['b', 1]
    yield ['c', 2]
    yield ['d', 3]
    yield ['e', 4]
  }
}
const result = toObject(iterable)

console.log(result)
// {
//   a: 0,
//   b: 1,
//   c: 2,
//   d: 3,
//   e: 4,
// }
```

### `toObjectAsync`

Convert async iterable filled with entries into object.

```ts
const toObject: <K extends PropertyKey, V>(iterable: AsyncIterable<readonly [K, V]>) => Promise<{ [key in K]: V }>
```

```ts
import { toObjectAsync } from 'iterama'

const iterable = {
  async *[Symbol.asyncIterator]() {
    yield await Promise.resolve(['a', 0])
    yield await Promise.resolve(['b', 1])
    yield await Promise.resolve(['c', 2])
    yield await Promise.resolve(['d', 3])
    yield await Promise.resolve(['e', 4])
  }
}
const result = await toObjectAsync(iterable)

console.log(result)
// {
//   a: 0,
//   b: 1,
//   c: 2,
//   d: 3,
//   e: 4,
// }
```

### `toMap`

Convert iterable filled with entries into Map.

```ts
const toMap: <K, V>(iterable: Iterable<readonly [K, V]>) => Map<K, V>
```

```ts
import { toMap } from 'iterama'

const iterable = {
  *[Symbol.iterator]() {
    yield ['a', 0]
    yield ['b', 1]
    yield ['c', 2]
    yield ['d', 3]
    yield ['e', 4]
  }
}
const result = toMap(iterable)

console.log(result)
// Map {
//   a → 0,
//   b → 1,
//   c → 2,
//   d → 3,
//   e → 4
// }
```

### `toMapAsync`

Convert async iterable filled with entries into Map.

```ts
const toMapAsync: <K, V>(iterable: AsyncIterable<readonly [K, V]>) => Promise<Map<K, V>>
```

```ts
import { toMapAsync } from 'iterama'

const iterable = {
  async *[Symbol.asyncIterator]() {
    yield await Promise.resolve(['a', 0])
    yield await Promise.resolve(['b', 1])
    yield await Promise.resolve(['c', 2])
    yield await Promise.resolve(['d', 3])
    yield await Promise.resolve(['e', 4])
  }
}
const result = await toMapAsync(iterable)

console.log(result)
// Map {
//   a → 0,
//   b → 1,
//   c → 2,
//   d → 3,
//   e → 4
// }
```
