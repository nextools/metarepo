import path from 'path'
import webpack, { Stats, Configuration as WebpackConfig } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// @ts-ignore
import InlineChunkWebpackPlugin from 'fixed-webpack4-html-webpack-inline-chunk-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { babelConfigWebApp } from '@bubble-dev/babel-config'
import { isObject } from 'tsfn'

const nodeModulesRegExp = /[\\/]node_modules[\\/]/

export type TBuildJsBundleOptions = {
  entryPointPath: string,
  outputPath: string,
  htmlTemplatePath: string,
  globalConstants?: {
    [key: string]: string,
  },
  globalAliases?: {
    [key: string]: string,
  },
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

export const buildRelease = (userOptions: TBuildJsBundleOptions) => {
  const options: TBuildJsBundleOptions = {
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
        '.web.ts',
        '.web.tsx',
        '.js',
        '.ts',
        '.tsx',
        '.json',
      ],
    },
    devtool: options.shouldGenerateSourceMaps ? 'source-map' : false,
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
            ...babelConfigWebApp,
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
        template: path.resolve(options.htmlTemplatePath),
      }),
      new InlineChunkWebpackPlugin({
        quiet: true,
        inlineChunks: ['runtime'],
      }),
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
      if (err) {
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
