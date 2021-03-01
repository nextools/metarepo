# ts-import-ext-plugin ![npm](https://flat.badgen.net/npm/v/ts-import-ext-plugin)

TypeScript plugin to allow explicit extension in imports, see [TypeScript/issues/38149](https://github.com/microsoft/TypeScript/issues/38149).

## Install

```sh
$ yarn add ts-import-ext-plugin
```

## Usage

```json
{
  "compilerOptions": {
    "plugins": [
      { "name": "ts-import-ext-plugin" }
    ]
  }
}
```

```ts
import { foo } from './foo.ts'
```
