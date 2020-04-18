# funcom ![npm](https://flat.badgen.net/npm/v/funcom)

Functional composition helpers.

## Install

```
yarn add funcom
```

## API

### `compose`

Sequential composition of functions invoked in reverse order. Passes return value of the previous function as an argument to the next one.

```ts
import { compose } from 'funcom'

const add4 = (a: number) => a + 4
const mult2 = (a: number) => a * 2

const composed = compose(mult2, add4)

console.log(
  composed(2)
)
// (2 + 4) * 2 => 12
```

### `composeAsync`

```ts
import { composeAsync } from 'funcom'

const add4Async= (arg: number) => Promise.resolve(arg + 40)
const mult2 = (a: number) => a * 2

const composed = composeAsync(mult2, add4Async)

console.log(
  await composed(2)
)
// (2 + 4) * 2 => 12
```

### `pipe`

Sequential composition of functions invoked in direct order. Passes return value of the previous function as an argument to the next one.

```ts
import { pipe } from 'funcom'

const add4 = (a: number) => a + 4
const mult2 = (a: number) => a * 2

const piped = pipe(mult2, add4)

console.log(
  piped(2)
)
// (2 * 2) + 4 => 8
```

### `pipeAsync`

```ts
import { pipeAsync } from 'funcom'

const mult2Async = (a: number) => Promise.resolve(a * 2)
const add4 = (a: number) => a + 4

const piped = pipeAsync(mult2Async, add4)

console.log(
  await piped(2)
)
// (2 * 2) + 4 => 8
```

### `all`

Composition of multiple functions invoked with same initial value. Returns an array of results.

```ts
import { all } from 'funcom'

const mult2 = (a: number) => a * 2
const add4 = (a: number) => a + 4
const toString = (a: number) => `${a}`

const piped = all(mult2, add4, toString)

console.log(
  piped(2)
)
// [8, 6, '2']
```

### `allAsync`

```ts
import { allAsync } from 'funcom'

const mult2 = (a: number) => a * 2
const add4 = (a: number) => a + 4
const toStringAsync = (a: number) => Promise.resolve(`${a}`)

const piped = allAsync(mult2Async, add4, toStringAsync)

console.log(
  await piped(2)
)
// [8, 6, '2']
```
