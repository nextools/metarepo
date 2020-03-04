# @bubble-dev/babel-worker

[Worker Threads](https://nodejs.org/api/worker_threads.html) wrapper that automatically applies `@babel/register` with [our config](https://github.com/bubble-dev/_/tree/master/packages/bubble-dev/babel-config).

## Install

```sh
$ yarn add @bubble-dev/babel-worker
```

## Usage

```js
import { BabelWorker } from '@bubble-dev/babel-worker'

const worker = BabelWorker('./file.ts', { workedData: 'hi' })
```
