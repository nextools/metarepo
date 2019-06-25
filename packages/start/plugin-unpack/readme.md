# 🗜 plugin-unpack

Unpack .tar/.tar.bz2/.tar.gz/.zip archives archives.

## Install

```sh
$ yarn add --dev @start/plugin-unpack
```

## Usage

### Signature

```ts
unpack(outDir: string)
```

### Example

```js
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import unpack from '@start/plugin-unpack'

export const task = () =>
  sequence(
    find('packed/*.tar'),
    unpack('unpacked/')
  )
```
