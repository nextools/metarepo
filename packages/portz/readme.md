# portz ![npm](https://flat.badgen.net/npm/v/portz)

Localhost service port registry and dependency queue manager.

## Install

```sh
$ yarn add portz
```

## Usage

### API

```ts
type TStartServerOptions = {
  fromPort: number,
  toPort: number
}

const startServer: (options: TStartServerOptions) => Promise<() => Promise<void>>
```

```ts
type TRegisterServiceOptions = {
  name: string,
  deps?: string[]
}

type TRegisterServiceResult = {
  port: number,
  deps?: {
    [k: string]: number
  },
}

const registerService: (options: TRegisterServiceOptions) => Promise<TRegisterServiceResult>
```

```ts
const unregisterService: (name: string) => Promise<void>
```

```ts
import { startServer, registerService } from 'portz'

const stopServer = await startServer({
  fromPort: 3000,
  toPort: 4000
})

console.log(
  await Promise.all([
    registerService({ name: 'foo', deps: ['bar'] }),
    registerService({ name: 'bar' }),
    registerService({ name: 'baz', deps: ['foo', 'bar'] }
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

### CLI

```sh
portz start --range 3000:4000
```

```sh
portz register --name foo -- echo $PORT
portz register --name bar --deps foo -- echo $PORT $PORT_FOO
```
