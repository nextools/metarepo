# rplace ![npm](https://flat.badgen.net/npm/v/rplace)

Transform stream by replacing strings.

## Install

```sh
$ yarn add rplace
```

## Usage

```ts
const replaceStream: (searchValue: RegExp | string, replaceValue: string) => Transform
```

Note: don't forget `g` flag for RegExp

```ts
import { createReadStream, createWriteStream } from 'fs'
import { lineStream } from 'stroki'
import { replaceStream } from 'rplace'

const readStream = createReadStream('./from.txt')
const writeStream = createWriteStream('./to.txt')

readStream
  .pipe(lineStream())
  .pipe(replaceStream(/Hi (\S+)/g, 'Hey $1'))
  .pipe(writeStream)
```
