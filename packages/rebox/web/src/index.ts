import path from 'path'
import Webpack from 'webpack'
import WebpackDevServer, { Configuration as TWebpackDevServerConfig } from 'webpack-dev-server'
import { getWebpackConfig } from './config'

export type TOptions = {
  entryPointPath: string,
  htmlTemplatePath: string,
  assetsPath: string,
}

export const runWeb = (options: TOptions) => {
  const compiler = Webpack(
    getWebpackConfig(
      path.resolve(options.entryPointPath),
      path.resolve(options.htmlTemplatePath)
    )
  )
  const { host, port, ...config }: TWebpackDevServerConfig = {
    host: '127.0.0.1',
    port: 3000,
    contentBase: path.resolve(options.assetsPath),
  }
  const server = new WebpackDevServer(compiler, config)

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
