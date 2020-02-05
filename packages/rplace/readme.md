# rplace

Transform stream by replacing strings on per-line basis, especially efficient with large multiline text file formats.

## Install

```sh
$ yarn add rplace
```

## Usage

```ts
replaceStream(searchValue: RegExp | string, replaceValue: string) => Transform
```

```ts
import { createReadStream } from 'fs'
import { replaceStream } from 'rplace'

const readStream = createReadStream('./from.txt')
const writeStream = createWriteStream('./to.txt')

readStream
  .pipe(replaceStream(/Hi (\S+)/, 'Hey $1'))
  .pipe(writeStream)
```
