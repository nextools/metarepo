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

[Jest "argv" options](https://github.com/facebook/jest/blob/ac8c345f5318016d0789974fbc815d857fd70d99/packages/jest-types/src/Config.ts#L417-L504).

### Example

```js
import jest from '@start/plugin-lib-jest'

export task () => jest({
  browser: true
})
```
