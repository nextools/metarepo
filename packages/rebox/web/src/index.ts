import path from 'path'
import Webpack from 'webpack'
import WebpackDevServer, { Configuration as TWebpackDevServerConfig } from 'webpack-dev-server'
import { getWebpackConfig } from './config'

export type TConfig = {
  entryPointPath: string,
  htmlTemplatePath: string,
  assetsPath: string,
}

export const runWeb = (config: TConfig) => {
  const compiler = Webpack(
    getWebpackConfig(
      path.resolve(config.entryPointPath),
      path.resolve(config.htmlTemplatePath)
    )
  )
  const { host, port, ...options }: TWebpackDevServerConfig = {
    host: '127.0.0.1',
    port: 3000,
    contentBase: path.resolve(config.assetsPath),
  }
  const server = new WebpackDevServer(compiler, options)

  return new Promise<void>((resolve, reject) => {
    compiler.hooks.done.tap('done', () => {
      resolve()
    })

    server
      .listen(port, host, (error) => {
        if (error) {
          reject(error)
        }
      })
      .on('error', reject)
  })
}
