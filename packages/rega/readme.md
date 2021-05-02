# rega ![npm](https://flat.badgen.net/npm/v/rega)

Localhost service registry and dependency queue manager.

## Install

```sh
$ yarn add rega
```

## Usage

```ts
import { startServer, registerService } from 'rega'

const stopServer = await startServer()
const fromPort = 3000
const toPort = 4000

console.log(
  await Promise.all([
    registerService({
      name: 'foo',
      fromPort,
      toPort,
      deps: ['bar']
    }),
    registerService({
      name: 'bar',
      fromPort,
      toPort
    }),
    registerService({
      name: 'baz',
      fromPort,
      toPort,
      deps: ['foo', 'bar']
    }
  ])
)
/*
[
  { port: 3001, deps: { bar: 3000 } },
  { port: 3000 },
  { port: 3002, deps: { foo: 3001, bar: 3000 } }
]
*/

await stopServer()
```
