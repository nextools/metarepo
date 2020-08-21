# rwrw ![npm](https://flat.badgen.net/npm/v/rwrw)

Rewrite file stream.

## Install

```sh
$ yarn add rwrw
```

## Usage

```ts
const rewriteStream: (filePath: string, options?: { highWatermark?: number }) =>
  Promise<{
    readableStream: Readable,
    writableStream: Writable
  }>
```

```ts
import { rewriteStream } from 'rwrw'
import { lineStream } from 'stroki'
import { replaceStream } from 'rplace'

const { readableStream, writableStream } = rewriteStream('./file.txt')

readableStream
  .pipe(lineStream())
  .pipe(replaceStream('hello', 'privet')
  .pipe(writableStream)
```
