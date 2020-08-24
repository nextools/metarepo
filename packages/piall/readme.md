# piall ![npm](https://flat.badgen.net/npm/v/piall)

Promise-Iterable-All. Like [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) and [`Promise.allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) but:

* takes Promise/value factories to invoke them lazily when needed
* returns ["async iterable"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator) to be consumed with [`for await...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
* iterates in whatever comes first order
* provides `concurrency` option

Consider using [p-all](https://github.com/sindresorhus/p-all) if you need just `Promise.all` with `concurrency` option.

## Install

```sh
$ yarn add piall
```

## API

```ts
const piAll: <T>(iterable: Iterable<() => Promise<T> | T, concurrency?: number) => AsyncIterable<T>
```

```ts
type TFulfilled<T> = {
  status: 'fulfilled',
  value: T,
}

type TRejected = {
  status: 'rejected',
  reason: Error | string,
}

const piAllSettled: <T>(iterable: Iterable<() => Promise<T> | T, concurrency?: number) => AsyncIterable<TFulfilled<T> | TRejected>
```

where:

* `iterable` – any iterable of Promise/value factories like array, Set values, Map entries, [etc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
* `concurrency` – number >=1, `Infinity` by default

## Usage

```ts
export const pDelay = <T>(ms: number, value: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}
```

```ts
import { piAll } from 'piall'
import { pDelay } from './p-delay'

const asyncIterable = piAll([
  () => pDelay(400, 'a'),
  () => pDelay(100, 'b'),
  () => pDelay(200, 'c'),
], 2)

for await (const result of asyncIterable) {
  console.log(result)
  // 'b'
  // 'c'
  // 'a'
}
```

```ts
import { piAllSettled } from 'piall'
import { pDelay } from './p-delay'

const asyncIterable = piAllSettled([
  () => pDelay(300, 'a'),
  () => pDelay(200, 'b'),
  () => Promise.reject('oops'),
  () => Promise.resolve('c'),
  () => pDelay(200, 'd'),
], 3)

for await (const result of asyncIterable) {
  console.log(result)
  // { status: 'rejected', reason: 'oops' }
  // { status: 'fulfilled', value: 'c' }
  // { status: 'fulfilled', value: 'b' }
  // { status: 'fulfilled', value: 'd' }
  // { status: 'fulfilled', value: 'a' }
}
```

## Thanks

To [Artem Tyurin](https://github.com/agentcooper) for a [really nice trick](https://agentcooper.io/iterate-promise-all/) with `Promise.race`.
