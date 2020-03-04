# workerama

Run sync/async function across [Worker Threads](https://nodejs.org/api/worker_threads.html). Input data array is chunked in parts and goes to each thread, where it runs with `Promise.all()`, benefiting from both [parallelism and concurrency](https://stackoverflow.com/questions/1050222/what-is-the-difference-between-concurrency-and-parallelism).

When it fails then it fails hard, i.e. it terminates entire thread pool. It's up to a consumer's worker function to retry or even swallow errors to keep things going.

## Install

```sh
$ yarn add workerama
```

## Usage

```ts
type TOptions = {
  items: any[],
  itemsPerThreadCount: number,
  maxThreadCount: number,
  fnFilePath: string,
  fnName: string,
  fnArgs: any[],
  onItemResult: (result: any, workerId: number) => void,
}

workerama(options: TOptions) => Promise<void>
```

```ts
import { workerama } from 'workerama'
import { cpus } from 'os'

await workerama({
  items: new Array(1000).fill(null).map((_, i) => i),
  itemsPerThreadCount: 5,
  maxThreadCount: cpus().length,
  fnFilePath: './test',
  fnName: 'add',
  fnArgs: [1],
  onItemResult: (result, workerId) => {
    process.stdout.write(`${workerId}:${result} `)
  },
})

process.stdout.write('\n')
```

```ts
// test.js

exports.add = (item, arg1) => Promise.resolve(item + arg1)
```

## TODO

[`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), [`Atomics`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) and [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) to avoid IPC channels and serializing/deserializing data as much as possible.
