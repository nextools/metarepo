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
<A, B>(arr: A[], key: B, comparator: (key: B, mid: A) => number) => number
```

```js
import binarySearch from 'bsc'

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const comparator = (key, mid) => key - mid

binarySearch(arr, 2, comparator) // 2
binarySearch(arr, 10, comparator) // -1
```
