# circularr ![npm](https://flat.badgen.net/npm/v/circularr)

Circular fixed size array.

## Install

```sh
$ yarn add circularr
```

## Usage

```ts
import Circularr from 'circularr'

// create from
const arrFrom = Circularr.from([1, 2, 3, 4, 5])

// create new with fixed size
const arr = new Circularr(3) // [undefined, undefined, undefined]

// fill using value
arr.fill(0) // [0, 0, 0]

// shift in some values
arr.shift(16) // [0, 0, 16]
arr.shift(32) // [0, 16, 32]

console.log(...arr) // undefined, 16, 32 
```

`Circularr` implements `iterable` protocol, so it can be used with any standard iterable syntax

```ts
const array = Circularr.from([1, 2, 3])

// array destructuring
const [firstValue] = array

// destructuring copy
const copyToArray = [...array]

// for..of
for (let value of array) {
  console.log(value)
}
```

## API

### `fill`

Fills the array using value, effectively resetting it.

```ts
fill(value: T): this
```

```ts
const array = new Circularr(3) // [undefined, undefined, undefined]

// mutate fill
array.fill(0) // [0, 0, 0]
```

### `shift`

Pushes value to the end of the array, wherein the first value gets popped out and returned.

```ts
shift(value: T): T
```

```ts
const array = new Circularr(3).fill(0)

array.shift(8) // [0, 0, 8] => 0
array.shift(16) // [0, 8, 16] => 0
array.shift(32) // [8, 16, 32] => 0
array.shift(64) // [16, 32, 64] => 8
array.length // 3
```

### `unshift`

Pushes the value to the front of the array, popping the last value out.

```ts
unshift(value: T): T
```

```ts
const array = new Circularr(3).fill(0)

array.unshift(8) // [8, 0, 0] => 0
array.unshift(16) // [16, 8, 0] => 0
array.unshift(32) // [32, 16, 8] => 0
array.unshift(64) // [64, 32, 16] => 8
array.length // 3
```

### `slice`

Does work the same way as `Array.slice`.

```ts
slice(startIndex?: number, endIndex?: number): Circularr<T>
```

```ts
const array = Circularr.from([1, 2, 3, 4])

const sliced = array.slice(1, 3) // [2, 3]
```

### `trim`

Removes `undefined` values from both ends.

```ts
trim(): Circularr<T>
```

```ts
const array = new Circularr<number>(5)

array.shift(1)
array.shift(2)

const trimmed = array.trim() // [1, 2]
```

### `at`

Returns element at the index or `undefined` for negative or overflow indices.

```ts
at(index: number): T | undefined
```

```ts
const array = new Circularr<number>(5)

array.shift(1)
array.shift(2)

const val0 = array.at(0) // undefined
const val1 = array.at(3) // 1
const val2 = array.at(4) // 2
const val3 = array.at(5) // undefined
```

### `wrapAt`

Returns element at the index. For negative and overflow indices - the index will be wrapped around, and correct value will be returned.

```ts
wrapAt(index: number): T | undefined
```

```ts
const array = new Circularr<number>(5)

array.shift(1)
array.shift(2)

const val0 = array.wrapAt(0) // undefined
const val1 = array.wrapAt(3) // 1
const val2 = array.wrapAt(4) // 2
const val3 = array.wrapAt(8) // 1
const val3 = array.wrapAt(9) // 2
```
