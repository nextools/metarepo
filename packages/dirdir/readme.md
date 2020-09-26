# dirdir ![npm](https://flat.badgen.net/npm/v/dirdir)

Make a directory.

* always recursive
* return full path instead of "first directory path created"
* return `null` instead of `undefined` when directory already exists

## Install

```sh
$ yarn add dirdir
```

## Usage

```ts
const makeDir: (dirPath: string) => Promise<string | null>
```

```ts
import { makeDir } from 'dirdir'

console.log(prcess.cwd())
// /foo

console.log(
  await makeDir('bar/baz')
)
// '/foo/bar/baz'

console.log(
  await makeDir('/foo')
)
// null
```
