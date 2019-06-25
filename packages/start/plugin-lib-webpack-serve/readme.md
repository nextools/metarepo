# 🏭 plugin-lib-webpack-serve

Run [Webpack development server](https://github.com/webpack-contrib/webpack-serve).

**⚠️ Deprecated in favor of [plugin-webpack-dev-server](https://github.com/deepsweet/start/tree/master/packages/plugin-lib-webpack-dev-server)**

## Install

```sh
$ yarn add --dev @start/plugin-lib-webpack-serve
```

## Usage

### Signature

```ts
webpackServe(options: {}, argv?: {}, )
```

#### `options`

[webpack-serve options](https://github.com/webpack-contrib/webpack-serve#serveoptions).

#### `argv`

[webpack-serve argv](https://github.com/webpack-contrib/webpack-serve#argv).

### Example

```js
import sequence from '@start/plugin-sequence'
import env from '@start/plugin-env'
import webpackServe from '@start/plugin-lib-webpack-serve'

export const task = async () => {
  const { default: webpackConfig } = await import('./webpack.config')

  return sequence(
    env({ NODE_ENV: 'development' }),
    webpackServe({ config: webpackConfig })
  )
}
```
