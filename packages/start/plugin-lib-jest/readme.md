# ✅ plugin-lib-jest

Run tests using [Jest](https://facebook.github.io/jest/).

## Install

```sh
$ yarn add --dev @start/plugin-lib-jest
```

## Usage

### Signature

```ts
jest(argv?: ArgvOptions)
```

#### `options`

[Jest "argv" options](https://github.com/facebook/jest/blob/cc5d630ec1cdbf8414ab78af800cb838d24ee63c/packages/jest-types/src/Config.ts#L358-L446).

### Example

```js
import jest from '@start/plugin-lib-jest'

export task () => jest({
  browser: true
})
```
