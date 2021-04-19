import path from 'path'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import { isUndefined } from 'tsfn'
import type { TJsonValue } from 'typeon'
import Webpack from 'webpack'
import type { Configuration as TWebpackConfig } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
// import type { Configuration as TWebpackDevConfig } from 'webpack-dev-server'
import { getBabelConfigRun } from './get-babel-config'
import { resolve } from './resolve'
// import { WatchPlugin } from './watch-plugin'

const excludeNodeModulesRegExp = /[\\/]node_modules[\\/]/
const HOST = '127.0.0.1'
const PORT = 3000

export type TRunWebAppOptions = {
  entryPointPath: string,
  htmlTemplatePath: string,
  browsersList?: string[],
  assetsPath?: string,
  props?: TJsonValue,
  isQuiet?: boolean,
  shouldOpenBrowser?: boolean,
}

export const runWebApp = async (options: TRunWebAppOptions): Promise<() => Promise<void>> => {
  const entryPointPath = path.resolve(options.entryPointPath)
  const htmlTemplatePath = path.resolve(options.htmlTemplatePath)
  const [
    loaderPath,
    babelLoaderPath,
    fileLoaderPath,
    rawLoaderPath,
  ] = await Promise.all([
    resolve('./loader.cjs'),
    resolve('babel-loader'),
    resolve('file-loader'),
    resolve('raw-loader'),
  ])

  const config: TWebpackConfig = {
    mode: 'development',
    entry: entryPointPath,
    output: {
      chunkFilename: '[name].[chunkhash].js',
      publicPath: '/',
      pathinfo: true,
    },
    devtool: 'cheap-module-source-map',
    resolve: {
      extensions: [
        '.web.js',
        '.web.jsx',
        '.web.ts',
        '.web.tsx',
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.json',
      ],
    },
    stats: {
      colors: true,
      assets: true,
      assetsSort: '!size',
      builtAt: false,
      children: false,
      entrypoints: false,
      errors: true,
      errorDetails: true,
      excludeAssets: [/\.js\.map$/],
      hash: false,
      modules: false,
      performance: true,
      timings: false,
      version: false,
      warnings: true,
    },
    module: {
      rules: [
        {
          test: entryPointPath,
          loader: loaderPath,
          options: {
            props: options.props ?? {},
          },
        },
        {
          test: /\.(ts|js)x?$/,
          exclude: excludeNodeModulesRegExp,
          loader: babelLoaderPath,
          options: {
            ...getBabelConfigRun(options.browsersList),
            cacheDirectory: true,
          },
        },
        {
          test: /\.(gif|jpg|jpeg|tiff|png)$/,
          // exclude: excludeNodeModulesRegExp,
          loader: fileLoaderPath,
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'images',
          },
        },
        {
          test: /\.mp4$/,
          // exclude: excludeNodeModulesRegExp,
          loader: fileLoaderPath,
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'videos',
          },
        },
        {
          test: /\.(md|txt)$/,
          // exclude: excludeNodeModulesRegExp,
          loader: rawLoaderPath,
        },
      ],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          vendor: {
            name: 'vendor',
            test: excludeNodeModulesRegExp,
            enforce: true,
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: htmlTemplatePath,
      }),
      // new WatchPlugin(),
    ],
  }
  const compiler = Webpack(config)
  // @ts-expect-error Webpack Dev Server external type doesn't match Webpack builtin type
  const server = new WebpackDevServer(compiler, {
    contentBase: isUndefined(options.assetsPath) ? false : path.resolve(options.assetsPath),
    open: options.shouldOpenBrowser,
    stats: options.isQuiet === true ? 'errors-only' : config.stats,
    noInfo: options.isQuiet,
    watchOptions: {
      ignored: excludeNodeModulesRegExp,
    },
  })

  return new Promise<() => Promise<void>>((resolve, reject) => {
    compiler.hooks.done.tap('done', () => {
      resolve(() => new Promise((resolve) => {
        server.close(resolve)
      }))
    })

    server
      .listen(PORT, HOST)
      .on('error', reject)
  })
}
