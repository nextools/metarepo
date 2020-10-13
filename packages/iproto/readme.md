# @iproto

[Async Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator) protocol over WebSocket.

* [server](server) is passive pull producer and [client](client) is active pull consumer
* one iterable – one server – one client
* propagates `break` from client and goes to `finally`-block on server
* only JSON data is supported, `ArrayBuffer`/`Blob` support may come in future
* server part is Node.js only, client works on Node.js, Web and React Native platforms

## Install

```sh
$ yarn install @iproto/server @iproto/client
```

## Usage

```ts
type TServeIterableOptions = {
  host: string,
  port: number
}

const serveIterable: <T extends TJsonValue>(iterable: AsyncIterable<T>, options: TServeIterableOptions) => Promise<() => Promise<void>>
```

```ts
type TGetIterableOptions = {
  host: string,
  port: number
}

const getIterable: <T extends TJsonValue>(options: TGetIterableOptions) => AsyncGenerator<T, any, any>
```

### client ← server

```ts
import { serveIterable } from '@iproto/server'
import { getIterable } from '@iproto/client'
import { getFreePort } from 'portu'
import { sleep } from 'sleap'

const host = 'localhost'
const port = await getFreePort(31337, 40000)

const serverIterable = {
  async *[Symbol.asyncIterator]() {
    for (let i = 1; i <=3; i++) {
      await sleep(100)
      yield i
    }
  }
}

await serveIterable(serverIterable, { host, port })

const clientIterable = getIterable<number>({ host, port })

for await (const value of clientIterable) {
  console.log(value)
  // 1
  // 2
  // 3
}
```

### client ↔︎ server

```ts
import { serveIterable } from '@iproto/server'
import { getIterable } from '@iproto/client'
import { getFreePort } from 'portu'
import { sleep } from 'sleap'

const host = 'localhost'
const port = await getFreePort(31337, 40000)

const serverIterable = {
  async *[Symbol.asyncIterator]() {
    for (let i = 1; i <=3; i++) {
      await sleep(100)
      console.log('from client:', yield i)
      // from client: 2
      // from client: 4
      // from client: 6
    }
  }
}

await serveIterable(serverIterable, { host, port })

const clientIterable = getIterable<number>({ host, port })
const iterator = clientIterable[Symbol.asyncIterator]()
let iteratorResult = await iterator.next()

while (!iteratorResult.done) {
  console.log('from server:', iteratorResult.value)
  // from server: 1
  // from server: 2
  // from server: 3

  iteratorResult = await iterator.next(iteratorResult.value * 2)
}
```
