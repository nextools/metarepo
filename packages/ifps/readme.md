# ifps ![npm](https://flat.badgen.net/npm/v/ifps)

FPS measurement as async iterable.

## Install

```sh
$ yarn add ifps
```

## Usage

```ts
const iterableFps: AsyncIterable<number>
```

```ts
import { iterableFps } from 'ifps'

for await (const fps of iterableFps) {
  console.log(fps)
}
```
