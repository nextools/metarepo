# 👔 plugin-env

Set environment variable using [`process.env`](https://nodejs.org/api/all.html#process_process_env).

## Install

```sh
$ yarn add --dev @start/plugin-env
```

## Usage

### Signature

```ts
env(vars: { [key: string]: any })
```

### Example

```js
import sequence from '@start/plugin-sequence'
import env from '@start/plugin-env'
import webpack from '@start/plugin-webpack'

export task = async () => {
 const { default: webpackConfig } = await import('./webpack-config')

  return sequence(
    env({ NODE_ENV: 'production' }),
    webpack(webpackConfig)
  )
}
```
