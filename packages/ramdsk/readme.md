# ramdsk ![npm](https://flat.badgen.net/npm/v/ramdsk)

Create/delete RAM disk, macOS/Linux only.

## Install

```sh
$ yarn add ramdsk
```

## Usage

```ts
const createRamDisk: (name: string, size: number) => Promise<string>

const deleteRamDisk: (diskPath: string) => Promise<void>
```

```ts
import { createRamDisk, deleteRamDisk } from 'ramdsk'

const diskPath = await createRamDisk('test', 1024 * 512)

console.log(diskPath)
// /Volumes/test

await deleteRamDisk(diskPath)
```
