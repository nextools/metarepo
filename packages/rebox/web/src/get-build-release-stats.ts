import path from 'path'
import webpack, { Stats, Configuration as WebpackConfig } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import { browsersList } from '@bubble-dev/browsers-list'
import { isObject } from 'tsfn'
import { Volume, createFsFromVolume } from 'memfs'
import joinPath from 'memory-fs/lib/join'
import CompressionPlugin from 'compression-webpack-plugin'

const vol = Volume.fromJSON({})
const fs = createFsFromVolume(vol) as any

fs.join = joinPath

const nodeModulesRegExp = /[\\/]node_modules[\\/]/

export type TGetBuildReleaseStatsOptions = {
  entryPointPath: string,
  globalConstants?: {
    [key: string]: string,
  },
  globalAliases?: {
    [key: string]: string,
  },
  stats: Stats.ToJsonOptionsObject,
}

export const getBuildReleaseStats = (options: TGetBuildReleaseStatsOptions): Promise<Stats.ToJsonOutput> => {
  const config: WebpackConfig = {
    mode: 'production',
    entry: path.resolve(options.entryPointPath),
    output: {
      path: '/dist/',
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].js',
      pathinfo: false,
    },
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
    devtool: false,
    module: {
      rules: [
        {
          test: path.resolve(options.entryPointPath),
          loader: require.resolve('./loader.js'),
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: nodeModulesRegExp,
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [
                require.resolve('@babel/preset-env'),
                {
                  targets: { browsers: browsersList },
                  modules: false,
                  useBuiltIns: 'usage',
                  corejs: 3,
                  ignoreBrowserslistConfig: true,
                  exclude: ['@babel/plugin-transform-regenerator'],
                },
              ],
              require.resolve('@babel/preset-react'),
              require.resolve('@babel/preset-typescript'),
            ],
            plugins: [
              require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
              require.resolve('@babel/plugin-proposal-optional-chaining'),
              require.resolve('@babel/plugin-syntax-bigint'),
              require.resolve('@babel/plugin-syntax-dynamic-import'),
            ],
            cacheDirectory: false,
          },
        },
        {
          test: /\.(gif|jpg|jpeg|tiff|png)$/,
          // exclude: nodeModulesRegExp,
          loader: require.resolve('file-loader'),
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'images',
          },
        },
        {
          test: /\.mp4$/,
          // exclude: nodeModulesRegExp,
          loader: require.resolve('file-loader'),
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'videos',
          },
        },
      ],
    },
    performance: {
      hints: false,
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          extractComments: true,
          terserOptions: {
            ecma: 8,
            output: {
              comments: false,
              beautify: false,
            },
            warnings: false,
          },
        }),
      ],
      runtimeChunk: {
        name: 'runtime',
      },
      splitChunks: {
        cacheGroups: {
          default: false,
          vendor: {
            name: 'vendor',
            test: nodeModulesRegExp,
            priority: 10,
            enforce: true,
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new CompressionPlugin({
        filename: '[name][ext].gz',
      }),
    ],
  }

  if (isObject(options.globalAliases)) {
    config.resolve!.alias = options.globalAliases
  }

  if (isObject(options.globalConstants)) {
    config.plugins!.push(
      new webpack.DefinePlugin(options.globalConstants)
    )
  }

  return new Promise<Stats.ToJsonOutput>((resolve, reject) => {
    const compiler = webpack(config)

    compiler.outputFileSystem = fs

    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      resolve(stats.toJson(options.stats))
    })
  })
}
