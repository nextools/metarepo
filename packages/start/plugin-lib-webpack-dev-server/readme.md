# 🏭 plugin-lib-webpack-dev-server

Run [Webpack development server](https://github.com/webpack/webpack-dev-server).

## Install

```sh
$ yarn add --dev @start/plugin-lib-webpack-dev-server
```

## Usage

### Signature

```ts
webpackServe(config: WebpackConfig, devServerConfig?: WebpackDevServerConfig)
```

#### `config`

[webpack config](https://webpack.js.org/configuration#options).

#### `devServerConfig`

[webpack `devServer` config](https://webpack.js.org/configuration/dev-server).

Default:

```js
{
  host: '127.0.0.1',
  port: 8080
}
```

### Example

```js
import sequence from '@start/plugin-sequence'
import env from '@start/plugin-env'
import webpackDevServer from '@start/plugin-lib-webpack-dev-server'

export const task = async () => {
  const { default: webpackDevConfig } = await import('./webpack.dev')

  return sequence(
    env({ NODE_ENV: 'development' }),
    webpackDevServer(
      webpackConfig,
      {
        hot: true,
        port: 3000
      }
    )
  )
}
```
