# Circularr
Fixed size array

## Install
`npm i circularr`

## Usage
```js
import Circularr from 'circularr'

// Create from
const arrFrom = Circularr.from([1, 2, 3, 4, 5])

// Create new with fixed size
const arr = new Circularr(3) // [undefined, undefined, undefined]

// fill using value
arr.fill(0)   // [0, 0, 0]

// shift in some values
arr.shift(16) // [0, 0, 16]
arr.shift(32) // [0, 16, 32]

// check contents
console.log(...arr) // undefined, 16, 32 
```

## Iterable
`Circularr` implements `iterable` protocol, so it can be used with any standard iterable syntax
```js
const array = Circularr.from([1, 2, 3])

// array destructuring
const [firstValue] = array

// destructuring copy
const copyToArray = [...array]

// for..of syntax
for (let value of array) {
  console.log(value)
}
```

## Api

### Fill
`fill(value: T): this`

Fills the array using value, effectively resetting it. Returns `this`. 
```js
const array = new Circularr(3) // [undefined, undefined, undefined]

/* mutate fill */
array.fill(0) // [0, 0, 0]
```

### Shift
`shift(value: T): T`

`shift` method pushes the value to the end of the array, wherein the first value gets popped out and returned.
```js
const array = new Circularr(3).fill(0)

array.shift(8)   // [0, 0, 8] => 0
array.shift(16)  // [0, 8, 16] => 0
array.shift(32)  // [8, 16, 32] => 0
array.shift(64)  // [16, 32, 64] => 8
array.length     // 3
```
### Unshift
`unshift(value: T): T`

`unshift` does the opposite. It pushes the value to the front, popping the last value out.
```js
const array = new Circularr(3).fill(0)

array.unshift(8)   // [8, 0, 0] => 0
array.unshift(16)  // [16, 8, 0] => 0
array.unshift(32)  // [32, 16, 8] => 0
array.unshift(64)  // [64, 32, 16] => 8
array.length       // 3
```

### Slice
`slice(beginIndex?: number, endIndex?: number): Circularr<T>`

`slice` does works the same way as Array.slice().
```js
const array = Circularr.from([1, 2, 3, 4])

const sliced = array.slice(1, 3) // [2, 3]
```

### Trim
`trim(): Circularr<T>`

`trim` returns new `Circularr` with removed `undefined` values from both ends.
```js
const array = new Circularr<number>(5)

array.shift(1)
array.shift(2)

const trimmed = array.trim() // [1, 2]
```

### At
`at(index: number): T | undefined`

`at` returns element at the index. For negative indices - `undefined` is returned. For overflow indices - `undefined` is returned
```js
const array = new Circularr<number>(5)

array.shift(1)
array.shift(2)

const val0 = array.at(0) // undefined
const val1 = array.at(3) // 1
const val2 = array.at(4) // 2
const val3 = array.at(5) // undefined
```

### WrapAt
`wrapAt(index: number): T | undefined`

`wrapAt` returns element at the index. For negative and overflow indices - the index will be wrapped around, and correct value will be returned
```js
const array = new Circularr<number>(5)

array.shift(1)
array.shift(2)

const val0 = array.at(0) // undefined
const val1 = array.at(3) // 1
const val2 = array.at(4) // 2
const val3 = array.at(8) // 1
const val3 = array.at(9) // 2
```
