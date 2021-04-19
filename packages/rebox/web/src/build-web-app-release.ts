import path from 'path'
// @ts-expect-error
import StatoscopeWebpackPlugin from '@statoscope/ui-webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { HwpInlineRuntimeChunkPlugin } from 'hwp-inline-runtime-chunk-plugin'
import { map } from 'iterama'
import TerserPlugin from 'terser-webpack-plugin'
import { isObject, isUndefined } from 'tsfn'
import type { TJsonValue } from 'typeon'
import webpack from 'webpack'
import type { Configuration as WebpackConfig } from 'webpack'
import { getBabelConfigBuildRelease } from './get-babel-config'
import { resolve } from './resolve'

const nodeModulesRegExp = /[\\/]node_modules[\\/]/

export type TBuildWebAppReleaseOptions = {
  entryPointPath: string,
  outputPath: string,
  htmlTemplatePath: string,
  browsersList?: string[],
  globalConstants?: {
    [key: string]: string,
  },
  globalAliases?: {
    [key: string]: string,
  },
  props?: TJsonValue,
  isQuiet?: boolean,
  shouldGenerateSourceMaps?: boolean,
  shouldGenerateBundleAnalyzerReport?: boolean,
}

export const buildWebAppRelease = async (userOptions: TBuildWebAppReleaseOptions): Promise<Iterable<string>> => {
  const options = {
    isQuiet: false,
    shouldGenerateSourceMaps: true,
    shouldGenerateBundleAnalyzerReport: true,
    ...userOptions,
  }
  const entryPointPath = path.resolve(options.entryPointPath)
  const outputPath = path.resolve(options.outputPath)
  const htmlTemplatePath = path.resolve(options.htmlTemplatePath)
  const [
    coreJsPath,
    loaderPath,
    babelLoaderPath,
    fileLoaderPath,
    rawLoaderPath,
  ] = await Promise.all([
    resolve('core-js'),
    resolve('./loader.cjs'),
    resolve('babel-loader'),
    resolve('file-loader'),
    resolve('raw-loader'),
  ])

  const config: WebpackConfig = {
    mode: 'production',
    entry: entryPointPath,
    output: {
      path: outputPath,
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[name].[chunkhash].js',
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
        'core-js': path.dirname(coreJsPath),
      },
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
      hash: false,
      modules: false,
      performance: false,
      relatedAssets: false,
      timings: false,
      version: false,
      warnings: true,
    },
    devtool: options.shouldGenerateSourceMaps ? 'source-map' : false,
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
          exclude: nodeModulesRegExp,
          loader: babelLoaderPath,
          options: {
            ...getBabelConfigBuildRelease(options.browsersList),
            cacheDirectory: false,
          },
        },
        {
          test: /\.(gif|jpg|jpeg|tiff|png)$/,
          // exclude: nodeModulesRegExp,
          loader: fileLoaderPath,
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'images',
          },
        },
        {
          test: /\.mp4$/,
          // exclude: nodeModulesRegExp,
          loader: fileLoaderPath,
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'videos',
          },
        },
        {
          test: /\.(md|txt)$/,
          // exclude: nodeModulesRegExp,
          loader: rawLoaderPath,
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
          parallel: true,
          extractComments: true,
          terserOptions: {
            output: {
              comments: false,
              beautify: false,
            },
          },
        }),
      ],
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          default: false,
          common: {
            name: 'common',
            chunks: 'async',
            minChunks: 3,
            minSize: 0,
          },
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
      new HtmlWebpackPlugin({
        inject: true,
        template: htmlTemplatePath,
      }),
      new HwpInlineRuntimeChunkPlugin({
        removeSourceMap: true,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  }

  if (options.shouldGenerateBundleAnalyzerReport) {
    config.plugins!.push(
      new StatoscopeWebpackPlugin({
        saveTo: path.resolve(options.outputPath, 'report.html'),
        open: false,
      })
    )
  }

  if (isObject(options.globalAliases)) {
    config.resolve!.alias = options.globalAliases
  }

  if (isObject(options.globalConstants)) {
    config.plugins!.push(
      new webpack.DefinePlugin(options.globalConstants)
    )
  }

  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err !== null) {
        return reject(err)
      }

      if (isUndefined(stats)) {
        return reject('Unable to get build stats')
      }

      const hasErrors = stats.hasErrors()
      const hasWarnings = stats.hasWarnings()

      if (!options.isQuiet || hasErrors || hasWarnings) {
        console.log(stats.toString(config.stats))
      }

      if (hasErrors) {
        return reject(null)
      }

      const emittedAssets = map(
        (emittedAsset: string) => path.join(options.outputPath, emittedAsset)
      )(stats.compilation.emittedAssets.values())

      resolve(emittedAssets)
    })
  })
}
