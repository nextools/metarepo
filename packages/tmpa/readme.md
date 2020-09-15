# tmpa ![npm](https://flat.badgen.net/npm/v/tmpa)

Get unique temp file or dir path.

## Install

```sh
$ yarn add tmpa
```

## Usage

```ts
const getTempFilePath: (extension?: string) => Promise<string>

const getTempDirPath: (prefix?: string) => Promise<string>
```

```ts
import { getTempFilePath, getTempDirPath } from 'tmpa'

console.log(
  await getTempFilePath('png')
)
// /private/var/folders/…/….png

console.log(
  await getTempDirPath('prefix-')
)
// /private/var/folders/…/prefix-…
```
