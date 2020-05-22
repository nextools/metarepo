# workerama ![npm](https://flat.badgen.net/npm/v/workerama)

Feed input data array items one by one to provided function that is automatically spread across [Worker Threads](https://nodejs.org/api/worker_threads.html).

When it fails then it fails hard, i.e. it terminates entire threads pool. It's up to a consumer's worker function to retry or even swallow errors to keep things going.

:warning: Node.js v10 needs an `--experimental-worker` flag.

## Install

```sh
$ yarn add workerama
```

## Usage

```ts
type TOptions = {
  items: any[],
  maxThreadCount: number,
  fnFilePath: string,
  fnName: string,
  fnArgs: any[]
}

const workerama: <T>(options: TOptions) => AsyncIterable<T>
```

```ts
import { workerama } from 'workerama'
import { cpus } from 'os'

const resultsIterable = workerama({
  items: Array.from({ length: 1000 }, (_, i) => i),
  maxThreadCount: cpus().length,
  fnFilePath: './test',
  fnName: 'add',
  fnArgs: [1],
})

for await (const result of resultsIterable) {
  process.stdout.write(`${workerId}:${result} `)
}

process.stdout.write('\n')
```

```js
// test.js

// factory function that receives `fnArgs`
exports.add = (arg1) => {
  // actual function that receives IteratorResult with per-item value
  return (item) => {
    if (!item.done) {
      Promise.resolve({
        value: item.value + arg1,
        transferList: []
      })
    }
  }
}
```

where:

* factory function – called once per worker, useful to initialize/instantiate something
* actual function – called once per item + once when it's done, must return special object:
  * `value` – actual result produced by function
  * `transferList` – [optional array](https://nodejs.org/dist/latest-v12.x/docs/api/worker_threads.html#worker_threads_port_postmessage_value_transferlist) of `ArrayBuffer` or `SharedArrayBuffer` (not to be confused with Node.js `Buffer`, but rather `Buffer.from([1, 2, 3]).buffer`) to be _moved_ from worker to parent to avoid cloning it and consuming double amount of memory
