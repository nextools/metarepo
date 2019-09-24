import path from 'path'
import Webpack, { Configuration as TWebpackConfig, Stats } from 'webpack'
import WebpackDevServer, { Configuration as TWebpackDevConfig } from 'webpack-dev-server'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import { browsersList } from '@bubble-dev/browsers-list'
import { isUndefined } from 'tsfn'

const excludeNodeModulesRegExp = /[\\/]node_modules[\\/]/

const statsOptions: Stats.ToStringOptionsObject = {
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
}

export type TServeJsBundleOptions = {
  entryPointPath: string,
  htmlTemplatePath: string,
  assetsPath?: string,
  shouldOpenBrowser?: boolean,
}

export const run = (options: TServeJsBundleOptions) => {
  const config: TWebpackConfig = {
    mode: 'development',
    entry: path.resolve(options.entryPointPath),
    output: {
      chunkFilename: '[name].[chunkhash].js',
      publicPath: '/',
      pathinfo: true,
    },
    devtool: 'cheap-module-source-map',
    resolve: {
      extensions: [
        '.web.js',
        '.web.ts',
        '.web.tsx',
        '.js',
        '.ts',
        '.tsx',
        '.json',
      ],
    },
    module: {
      rules: [
        {
          test: path.resolve(options.entryPointPath),
          loader: require.resolve('./loader.js'),
        },
        {
          test: /\.tsx?$/,
          exclude: excludeNodeModulesRegExp,
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            presets: [
              [
                require.resolve('@babel/preset-env'),
                {
                  targets: { browsers: browsersList },
                  exclude: ['@babel/plugin-transform-regenerator'],
                  ignoreBrowserslistConfig: true,
                  modules: false,
                },
              ],
              require.resolve('@babel/preset-react'),
              require.resolve('@babel/preset-typescript'),
            ],
            plugins: [
              require.resolve('@babel/plugin-syntax-dynamic-import'),
            ],
            cacheDirectory: true,
          },
        },
        {
          test: /\.(png|jpg)$/,
          // exclude: excludeNodeModulesRegExp,
          loader: require.resolve('file-loader'),
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'images',
          },
        },
        {
          test: /\.mp4$/,
          // exclude: excludeNodeModulesRegExp,
          loader: require.resolve('file-loader'),
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'videos',
          },
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
        template: path.resolve(options.htmlTemplatePath),
      }),
    ],
  }
  const compiler = Webpack(config)
  const { host, port, ...devConfig }: TWebpackDevConfig = {
    host: '127.0.0.1',
    port: 3000,
    contentBase: isUndefined(options.assetsPath) ? false : path.resolve(options.assetsPath),
  }
  const server = new WebpackDevServer(compiler, {
    ...devConfig,
    open: options.shouldOpenBrowser,
    stats: statsOptions,
  })

  return new Promise<() => Promise<void>>((resolve, reject) => {
    compiler.hooks.done.tap('done', () => {
      resolve(() => new Promise((resolve) => {
        server.close(resolve)
      }))
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
