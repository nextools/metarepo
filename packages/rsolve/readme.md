# rsolve

Resolve module path with custom entry point `package.json` field relative to caller file.

## Install

```sh
$ yarn add rsolve
```

## Usage

```ts
rsolve(id: string, fieldName: string) => Promise<string>
```

```ts
import { rsolve } from 'rsolve'

console.log(
  await rsolve('package', 'main')
)
console.log(
  await rsolve('@scope/package', 'browser')
)
console.log(
  await rsolve('../relative/path/to/package', 'react-native')
)
```
