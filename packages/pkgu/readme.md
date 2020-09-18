# pkgu ![npm](https://flat.badgen.net/npm/v/pkgu)

Yarn Workspaces package utils.

## Install

```sh
$ yarn add pkgu
```

## Usage

```ts
type TPackageJson = {
  name: string,
  version: string,
  // …
}

type TPackages = Map<string, {
  dir: string,
  json: TPackageJson
}>

const getPackageDirs: () => Promise<Set<string>>

const getPackages: () => Promise<TPackages>

const readPackageJson: (packageDir: string) => Promise<TPackageJson>

const writePackageJson: (packageDir: string, packageJson: TPackageJson) => Promise<void>
```

```ts
import { getPackageDirs, getPackages, readPackageJson, writePackageJson } from 'pkgu'

console.log(
  await getPackageDirs()
)
// Set(2) { '/…/packages/bar', '/…/packages/baz' }

console.log(
  await getPackages()
)
// Map(2) {
//   'bar' => {
//     dir: '/…/packages/bar',
//     json: {
//       name: 'bar',
//       version: '1.0.0'
//     }
//   },
//   'baz' => {
//     dir: '/…/packages/baz',
//     json: {
//       name: 'baz',
//       version: '2.0.0'
//     }
//   },
// }

console.log(
  await readPackageJson('/…/packages/bar') 
)
// {
//   name: 'bar',
//   version: '1.0.0'
// }

await writePackageJson('/…/packages/bar', { name: 'foo' }) 

console.log(
  await readPackageJson('/…/packages/bar') 
)
// { name: 'foo' }
```
