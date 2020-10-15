# portu ![npm](https://flat.badgen.net/npm/v/portu)

Port utils.

## Install

```sh
$ yarn add portu
```

## Usage

```ts
const isPortFree: (port: number, host: string) => Promise<boolean>

const getFreePort: (from: number, to: number, host: string) => Promise<number>

const getPortProcess: (port: number, host: string) => Promise<number | null>

const killPortProcess: (port: number, host: string) => Promise<number | null>

const waitForPort: (port: number, host: string) => Promise<void>
```

```ts
import { isPortFree, getFreePort, getPortProcess, killPortProcess, waitForPort } from 'portu'

const host = 'localhost'
const port = 31337

const isFree = await isPortFree(port, host)
// true

const port = await getFreePort(port, port + 10, host
// 31337

let pid = await getPortProcess(port, host)
// null

pid = await killPortProcess(port, host)
// null

await waitForPort(port, host)
// checks every 200ms
```
