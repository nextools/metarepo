# takes ![npm](https://flat.badgen.net/npm/v/takes)

High-resolution timer to measure how long it takes.

## Install

```sh
$ yarn add takes
```

## Usage

```ts
import { startTimeNs } from 'takes'
import { sleep } from 'sleap'

const endTimeNs = startTimeNs()

await sleep(1000)

const tookNs = endTimeNs()

console.log(`${tookNs}ns`)
```

```ts
import { startTimeMs } from 'takes'
import { sleep } from 'sleap'

const endTimeMs = startTimeMs()

await sleep(1000)

const tookMs = endTimeMs()

console.log(`${tookMs}ms`)
```
