# Iterama
Composable functional `Iterable<T>` helpers.

### Install
```ts
npm install iterama
```

### `concat`
`<T> (...iterables: Iterable<T>[]) => Iterable<T>`
```ts
import { concat } from 'iterama'

const data0 = [1, 2, 3],
      data1 = [4, 5, 6]

const result = [
  ...concat(data0, data1)
]

// [1, 2, 3, 4, 5, 6]
```

### `distinct`
`<T> (iterable: Iterable<T>) => Iterable<T>`
```ts
import { distinct } from 'iterama'

const result = [
  ...distinct([1, 1, 3, 3, 4, 3])
]

// [1, 3, 4, 3]
```

### `filter`
`<T> (predicate: (arg: T) => boolean) => (iterable: Iterable<T>) => Iterable<T>`
```ts
import { filter } from 'iterama'

const isEven = (x: number) => x % 2 === 0

const result = [
  ...filter(isEven)([1, 2, 3, 4])
]

// [2, 4]
```

### `filterEx`
`<T> (predicate: (arg: T, index: number, it: Iterable<T>) => boolean) => (iterable: Iterable<T>) => Iterable<T>`
```ts
import { filterEx } from 'iterama'

const skipEverySecond = (x: string, i: number) => i % 2 !== 0

const result = [
  ...filterEx(skipEverySecond)(['a', 'b', 'c', 'd'])
]

// ['a', 'c']
```

### `iterate`
`<T> (iterable: Iterable<T>) => IterableIterator<T>`
```ts
import { iterate } from 'iterama'

const result = [
  ...iterate([1, 2, 3, 4, 5])
]

// [1, 2, 3, 4, 5]
```

### `length`
`(maxLength: number) => <T> (iterable: Iterable<T>) => number`
```ts
import { length } from 'iterama'

const l = length(Number.MAX_SAFE_INTEGER)
const result = l([1, 2, 3, 4, 5])

// 5
```

### `map`
`<T, R> (xf: (arg: T) => R) => (iterable: Iterable<T>) => Iterable<R>`
```ts
import { map } from 'iterama'

const mult2 = (x: number) => x * 2
 
const result = [
  ...map(mult2)([1, 2, 3, 4])
]

// [2, 4, 6, 8]
```

### `mapEx`
`<T, R> (xf: (arg: T, i: number, it: Iterable<T>) => R) => (iterable: Iterable<T>) => Iterable<R>`
```ts
import { mapEx } from 'iterama'

const addIndex = (x: number, i: number) => x + i
 
const result = [
  ...mapEx(addIndex)([1, 2, 3, 4])
]

// [1, 3, 5, 7]
```

### `range`
`(length: number) => Iterable<number>`
```ts
import { range } from 'iterama'

const result = [
  ...range(4)
]

// [0, 1, 2, 3]
```

### `reduce`
`<T, R> (reducer: (a: R, b: T) => R) => (iterable: Iterable<T>) => Iterable<R>`
```ts
import { reduce } from 'iterama'

// redux like reducer
const reducer = (state: number = 0, b: number = 0) => a + b

const result = [
  ...reduce(reducer)([1, 2, 3, 4])
]

// [10]
```

### `reduceEx`
`<T, R> (reducer: (a: R, b: T, i: number, it: Iterable<T>) => R, initial: R) => (iterable: Iterable<T>) => Iterable<R>`
```ts
import { reduceEx } from 'iterama'

// JavaScript like reducer
const reducer = (acc: number, val: number, i: number) => acc + val

const result = [
  ...reduceEx(reducer, 0)([1, 2, 3, 4])
]

// [10]
```

### `scan`
`<T, R> (reducer: (a: R, b: T) => R) => (iterable: Iterable<T>) => Iterable<R>`
```ts
import { scan } from 'iterama'

// redux like reducer
const reducer = (state: number = 0, b: number = 0) => a + b

const result = [
  ...scan(reducer)([1, 2, 3, 4])
]

// [1, 3, 6, 10]
```

### `scanEx`
`<T, R> (reducer: (a: R, b: T, i: number, it: Iterable<T>) => R) => (iterable: Iterable<T>) => Iterable<R>`
```ts
import { scanEx } from 'iterama'

// JavaScript like reducer
const reducer = (acc: number, val: number, i: number) => acc + val

const result = [
  ...scanEx(reducer, 0)([1, 2, 3, 4])
]

// [1, 3, 6, 10]
```

### `skip`
`(n: number) => <T> (iterable: Iterable<T>) => Iterable<T>`
```ts
import { skip } from 'iterama'

// skip first 2 items
const result0 = [
  ...skip(2)([1, 2, 3, 4, 5, 6])
]
// [3, 4, 5, 6]


// skip all until 2 items to the end
const result1 = [
  ...skip(-2)([1, 2, 3, 4, 5, 6])
]
// [1, 2, 3, 4]
```


### `slice`
`(skip: number, take: number) => <T> (it: Iterable<T>): Iterable<T>`
```ts
import { slice } from 'iterama'

// skip 1, take 2
const r0 = [
  ...slice(1, 2)([1, 2, 3, 4, 5])
]
// [2, 3]

// skip until 2 from end, take 1
const r1 = [
  ...slice(-2, 1)([1, 2, 3, 4, 5])
]
// [4]

// don't skip, take last 2
const r2 = [
  ...slice(0, -2)([1, 2, 3, 4, 5])
]
// [1, 2, 3]

// skip 2, take the rest
const r3 = [
  ...slice(2)([1, 2, 3, 4, 5])
]
// [3, 4, 5]

// skip until 2 from end, take the rest
const r4 = [
  ...slice(-2)([1, 2, 3, 4, 5])
]
// [4, 5]

// don't skip, take all
const r5 = [
  ...slice()([1, 2, 3, 4, 5])
]
// [1, 2, 3, 4, 5]
```

### `startWith`
`<T> (value: T) => (iterable: Iterable<T>)`
```ts
import { startWith } from 'iterama'

const r = [
  ...startWith(0)([1, 2, 3])
]
// [0, 1, 2, 3]
```

### `take`
`(n: number) => <T> (iterable: Iterable<T>) => Iterable<T>`
```ts
import { take } from 'iterama'

// take 2 first items, skip the rest
const r0 = [
  ...take(2)([1, 2, 3, 4, 5])
]
// [1, 2]

// take 2 last items 
const r1 = [
  ...take(-2)([1, 2, 3, 4, 5])
]
// [4, 5]
```

### `unique`
`<T> (iterable: Iterable<T>) => Iterable<T>`
```ts
import { unique } from 'iterama'

const r = [
  ...unique([1, 1, 3, 4, 3])
]
// [1, 3, 4]
```

### `zip`
`<A, B> (it0: Iterable<A>, it1: Iterable<B>): Iterable<[A, B]>`
`<A, B, C> (it0: Iterable<A>, it1: Iterable<B>, it2: Iterable<C>): Iterable<[A, B, C]>`
`<A, B, C, D> (it0: Iterable<A>, it1: Iterable<B>, it2: Iterable<C>, it3: Iterable<C>): Iterable<[A, B, C, D]>`
```ts
import { zip } from 'iterama'

const r = [
  ...zip([1, 2, 3, 4, 5, 6], ['a', 'b', 'c', 'd'])
]
// [ [1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'] ]
```
