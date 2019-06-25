# 🏭 plugin-lib-esm-loader

Copy a predefined [ESM loader](https://github.com/standard-things/esm) file to a directory.

## Install

```sh
$ yarn add --dev @start/plugin-lib-esm-loader
```

## Usage

### Signature

```ts
copyEsmLoader(outDir: string, filename: string = 'esm-loader.js')
```

### Example

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "build/esm-loader.js",
  "module": "build/index.js",
  "dependencies": {
    "esm": "^3.0.75"
  }
}
```

```js
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import read from '@start/plugin-read'
import babel from '@start/plugin-lib-babel'
import write from '@start/plugin-write'
import copyEsmLoader from '@start/plugin-lib-esm-loader'

const babelConfig = {
  // …
  babelrc: false,
  sourceMaps: true,
  presets: [
    ['@babel/preset-env', {
      targets: { node: 6 },
      modules: false
    }]
  ]
}

export const task = () =>
  sequence(
    find('src/**/*.js'),
    read,
    babel(babelConfig),
    write('build/'),
    copyEsmLoader('build/')
  )
```
