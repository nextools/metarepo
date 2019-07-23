import path from 'path'
import { Configuration as WebpackConfig } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// @ts-ignore
import InlineChunkWebpackPlugin from 'fixed-webpack4-html-webpack-inline-chunk-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { browsersList } from '@bubble-dev/browsers-list'

export const getConfig = (entryPointPath: string, outputPath: string, htmlTemplatePath: string): WebpackConfig => ({
  mode: 'production',
  entry: require.resolve('./App.js'),
  output: {
    path: outputPath,
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
    pathinfo: true,
  },
  resolve: {
    alias: {
      __REBOX_ENTRY_POINT__: entryPointPath,
    },
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
        test: /\.(ts|tsx)$/,
        exclude: path.resolve('node_modules/'),
        use: [
          {
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
                require.resolve('@babel/plugin-transform-runtime'),
                require.resolve('@babel/plugin-syntax-dynamic-import'),
              ],
              cacheDirectory: false,
            },
          },
        ],
      },
      {
        test: /\.png$/,
        exclude: /node_modules/,
        loader: 'images/[name].[hash].[ext]',
      },
      {
        test: /\.mp4$/,
        exclude: /node_modules/,
        loader: 'videos/[name].[hash].[ext]',
      },
    ],
  },
  performance: {
    hints: false,
  },
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
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
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          enforce: true,
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: htmlTemplatePath,
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
})
