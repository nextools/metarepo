import path from 'path'
import webpack, { Stats, Configuration as WebpackConfig } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// @ts-ignore
import InlineChunkWebpackPlugin from 'fixed-webpack4-html-webpack-inline-chunk-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { browsersList } from '@bubble-dev/browsers-list'

const nodeModulesRegExp = /[\\/]node_modules[\\/]/

export type TBuildJsBundleOptions = {
  entryPointPath: string,
  outputPath: string,
  htmlTemplatePath: string,
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

export const buildRelease = (options: TBuildJsBundleOptions) => {
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
    devtool: 'source-map',
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
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        logLevel: 'silent',
      }),
    ],
  }

  return new Promise<void>((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        return reject(err)
      }

      console.log(stats.toString(statsOptions))

      resolve()
    })
  })
}
