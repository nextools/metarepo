import path from 'path'
import Webpack from 'webpack'
import WebpackDevServer, { Configuration as TWebpackDevServerConfig } from 'webpack-dev-server'
import { getConfig } from './get-config'

export type TRunWebOptions = {
  entryPointPath: string,
  htmlTemplatePath: string,
  assetsPath: string,
}

export const runWeb = (options: TRunWebOptions) => {
  const compiler = Webpack(
    getConfig(
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
