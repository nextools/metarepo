import path from 'path'
import CompressionPlugin from 'compression-webpack-plugin'
import { Volume, createFsFromVolume } from 'memfs'
import joinPath from 'memory-fs/lib/join'
import TerserPlugin from 'terser-webpack-plugin'
import { isObject } from 'tsfn'
import webpack from 'webpack'
import type { Configuration as WebpackConfig, OutputFileSystem } from 'webpack'
import { babelConfig } from './babel-config'

const vol = Volume.fromJSON({})
const fs = createFsFromVolume(vol) as unknown as OutputFileSystem

// https://github.com/webpack/memory-fs/issues/67
// https://github.com/webpack/memory-fs/issues/72
fs.join = joinPath

const nodeModulesRegExp = /[\\/]node_modules[\\/]/
const statsOptions = {
  entrypoints: false,
  modules: false,
  assets: true,
  chunks: false,
  chunkModules: false,
  chunkOrigins: false,
  builtAt: false,
  children: false,
  timings: false,
  version: false,
}

export type TGetBuildReleaseStatsOptions = {
  entryPointPath: string,
  globalConstants?: {
    [key: string]: string,
  },
  globalAliases?: {
    [key: string]: string,
  },
}

type TOutput = {
  vendor: {
    min: number,
    minGzip: number,
  },
  main: {
    min: number,
    minGzip: number,
  },
}

export const getBundleSize = (userOptions: TGetBuildReleaseStatsOptions): Promise<TOutput> => {
  const options = {
    isQuiet: false,
    ...userOptions,
  }
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
        '.web.jsx',
        '.web.ts',
        '.web.tsx',
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.json',
      ],
      alias: {
        'core-js': path.dirname(require.resolve('core-js')),
      },
    },
    devtool: false,
    module: {
      rules: [
        {
          test: path.resolve(options.entryPointPath),
          loader: require.resolve('./loader.js'),
        },
        {
          test: /\.(js|ts)x?$/,
          exclude: nodeModulesRegExp,
          loader: require.resolve('babel-loader'),
          options: {
            ...babelConfig,
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
        cache: false,
        minRatio: Infinity,
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

  return new Promise<TOutput>((resolve, reject) => {
    const compiler = webpack(config)

    compiler.outputFileSystem = fs

    compiler.run((err, stats) => {
      if (err !== null) {
        return reject(err)
      }

      if (stats.hasErrors()) {
        console.log(stats.toString('errors-only'))

        return reject('Compile errors')
      }

      const result = stats.toJson(statsOptions)

      resolve({
        vendor: {
          min: result.assets!.find((asset) => asset.name === result.assetsByChunkName!.vendor)!.size,
          minGzip: result.assets!.find((asset) => asset.name === `${result.assetsByChunkName!.vendor}.gz`)!.size,
        },
        main: {
          min: result.assets!.find((asset) => asset.name === result.assetsByChunkName!.main)!.size,
          minGzip: result.assets!.find((asset) => asset.name === `${result.assetsByChunkName!.main}.gz`)!.size,
        },
      })
    })
  })
}
