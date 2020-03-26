# @nextools/babel-worker

[Worker Threads](https://nodejs.org/api/worker_threads.html) wrapper that automatically applies `@babel/register` with [our config](https://github.com/nextools/metarepo/tree/master/packages/nextools/babel-config).

## Install

```sh
$ yarn add @nextools/babel-worker
```

## Usage

```js
import { BabelWorker } from '@nextools/babel-worker'

const worker = BabelWorker('./file.ts', { workedData: 'hi' })
```
