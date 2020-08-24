# yupg ![npm](https://flat.badgen.net/npm/v/yupg)

Yarn upgrade package.

## Install

```sh
$ yarn add yupg
```

## Usage

```ts
const upgradeDependency: (depName: string) => Promise<void>
```

```ts
import { upgradeDependency } from 'yupg'

await upgradeDependency('foo')
```
