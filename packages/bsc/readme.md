# bsc

Binary search with comparator.

* tests not only for the result but for how many steps it takes as well
* always return `-1` if nothing has been found, no "insertion point" negative values
* no "lower" or "upper bounds"

## Install

```sh
$ yarn add bsc
```

## Usage

```ts
<T>(arr: T[], comparator: (item: T) => number) => number
```

```js
import binarySearch from 'bsc'

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// if comparator return `0` then that item is the result index
binarySearch(arr, (item) => 2 - item) // 2
binarySearch(arr, (item) => 10 - item) // -1
```
