# stroki ![npm](https://flat.badgen.net/npm/v/stroki)

Transform stream by reading it line by line.

## Install

```sh
$ yarn add stroki
```

## Usage

```ts
const lineStream: () => Transform
```

```ts
import { createReadStream, createWriteStream } from 'fs'
import { lineStream } from 'stroki'

const readStream = createReadStream('./lines.txt')

readStream
  .pipe(lineStream())
  .on('data', (chunk: Buffer) => {
    console.log('line:', chunk.toString('utf8'))
  })
```
