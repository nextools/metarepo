# 🏭 plugin-lib-typescript-generate

Generate `.d.ts` files using [TypeScript](https://www.typescriptlang.org/).

## Install

```sh
$ yarn add --dev @start/plugin-lib-typescript-generate
```

## Usage

### Signature

```ts
typescriptGenerate(inDir: string, outDir: string)
```

### Example

```js
import typescriptGenerate from '@start/plugin-lib-typescript-generate'

export const task = () => typescriptGenerate('src/', 'build/')
```
