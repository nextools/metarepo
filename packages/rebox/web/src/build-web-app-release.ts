import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// @ts-ignore
import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin'
import TerserPlugin from 'terser-webpack-plugin'
import { isObject } from 'tsfn'
import type { TJsonValue } from 'typeon'
import webpack from 'webpack'
import type { Configuration as WebpackConfig, Stats } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { getBabelConfigBuildRelease } from './get-babel-config'

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

export const buildWebAppRelease = (userOptions: TBuildWebAppReleaseOptions) => {
  const options = {
    isQuiet: false,
    shouldGenerateSourceMaps: true,
    shouldGenerateBundleAnalyzerReport: true,
    ...userOptions,
  }
  const config: WebpackConfig = {
    mode: 'production',
    entry: path.resolve(options.entryPointPath),
    output: {
      path: path.resolve(options.outputPath),
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
        'core-js': path.dirname(require.resolve('core-js')),
      },
    },
    devtool: options.shouldGenerateSourceMaps ? 'source-map' : false,
    module: {
      rules: [
        {
          test: path.resolve(options.entryPointPath),
          loader: require.resolve('./loader.js'),
          options: {
            props: options.props ?? {},
          },
        },
        {
          test: /\.(ts|js)x?$/,
          exclude: nodeModulesRegExp,
          loader: 'babel-loader',
          options: {
            ...getBabelConfigBuildRelease(options.browsersList),
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
        {
          test: /\.(md|txt)$/,
          loader: require.resolve('raw-loader'),
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
        template: path.resolve(options.htmlTemplatePath),
      }),
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/]),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  }

  if (options.shouldGenerateBundleAnalyzerReport) {
    config.plugins!.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        logLevel: 'silent',
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

  return new Promise<void>((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err !== null) {
        return reject(err)
      }

      const hasErrors = stats.hasErrors()

      if (!options.isQuiet || hasErrors) {
        console.log(stats.toString(statsOptions))
      }

      if (hasErrors) {
        return reject(null)
      }

      resolve()
    })
  })
}
