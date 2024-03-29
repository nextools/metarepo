# portz ![npm](https://flat.badgen.net/npm/v/portz)

Service port registry and dependency queue manager.

Allows to run services concurrently respecting cross-dependencies by waiting for TCP port to become in use on `0.0.0.0` interface.

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

```json
{
  "scripts": {
    "foo": "echo $PORT",
    "bar": "echo $PORT $PORT_FOO"
  }
}
```

```sh
portz start --range 3000:4000
```

```sh
portz register --name foo -- npm run foo
portz register --name bar --deps foo -- npm run bar
```
