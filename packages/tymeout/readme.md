# Wait
Functional `setTimeout` and `setInterval`.

### Install
```ts
npm install tymeout
```

### `wait`
`(timeGetter?: () => number) => (cb: () => void) => (ms?: number) => () => void`
```ts
import { wait } from 'tymeout'

// Signature
(timeGetter?: () => number) =>   // optional timeGetter, defaults to () => 0
  (callback: () => void) =>      // callback
  (ms?: number) =>               // optional timeout ms, defaults to timeGetter()
  () => void                     // returns cancel function
```
Usage with `timeGetter`:
```ts
const timeGetter = () => Math.random() * 1000

// create waiter function
const waiter = wait(timeGetter)(callback)

// invoke waiter
const cancel = waiter() // timeout is taken from timeGetter

// clear timeout
cancel()
```
Usage with milliseconds:
```ts
// create waiter function, skip timeGetter
const waiter = wait()(callback)

// invoke waiter
const cancel = waiter(1000) // provide time

// clear timeout
cancel()
```

### `wait-promise`
`(timeGetter?: () => number) => (ms?: number) => Promise<void>`
```ts
import { waitPromise } from 'tymeout'

// Signature
(timeGetter: () => number) =>   // optional timeGetter, defaults to () => 0
  (ms = timeGetter()) =>        // optional timeout ms, defaults to timeGetter()
  Promise<void>                 // returns Promise
```
Usage with `timeGetter`:
```ts
const timeGetter = () => Math.random() * 1000

// create waiter function
const waiter = waitPromise(timeGetter)

// invoke waiter
await waiter() // timeout is taken from timeGetter
```
Usage with milliseconds:
```ts
// create waiter function, skip timeGetter
const waiter = waitPromise()

// invoke waiter
await waiter(1000) // provide time
```

### `ping`
`(timeGetter: () => number) => (cb: () => void) => () => () => void`
```ts
import { ping } from 'tymeout'

// Signature
(timeGetter: () => number) =>  // timeGetter 
  (callback: () => void) =>    // callback
  () =>                        // invoke to run
  () => void                   // returns cancel function
```
Usage:
```ts
const timeGetter = () => Math.random() * 1000

// create pinger function
const pinger = ping(timeGetter)(callback)

// run pinger
const cancel = pinger() // returns cancel function

// cancel ping
cancel()
```

### `wait-time`
`(cb: () => void) => (ms: number) => () => void`
Same as `wait`, but without `timeGetter`
```ts
import { waitTime } from 'tymeout'

// Signature
(callback: () => void) =>  // provide callback
  (ms: number) =>          // provide timeout ms
  () => void               // returns cancel function
```
Usage:
```ts
// create waiter function
const waiter = waitTime(callback)

// invoke waiter
const cancel = waiter(1000) // provide time

// clear timeout
cancel()
```

### `wait-time-promise`
`(ms: number) => Promise<void>`
Same as `wait-promise`, but without `timeGetter`
```ts
import { waitTimePromise } from 'tymeout'

// Signature
(ms: number) =>   // provide timeout ms
  Promise<void>   // returns Promise
```
Usage:
```ts
// invoke waiter
await waitTimePromise(1000) // provide time
```
