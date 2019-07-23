import HTMLWebpackPlugin from 'html-webpack-plugin'
import { Configuration as WebpackConfig } from 'webpack'
import { Configuration as TWebpackDevServerConfig } from 'webpack-dev-server'
import { browsersList } from '@bubble-dev/browsers-list'

export type TWebpackConfig = WebpackConfig & {
  devServer?: TWebpackDevServerConfig,
}

export const getConfig = (entryPointPath: string, htmlTemplatePath: string): TWebpackConfig => ({
  mode: 'development',
  entry: require.resolve('./App.js'),
  output: {
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
    pathinfo: true,
  },
  devtool: 'cheap-module-source-map',
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
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
          {
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
                require.resolve('@babel/plugin-transform-runtime'),
                require.resolve('@babel/plugin-syntax-dynamic-import'),
              ],
              cacheDirectory: true,
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
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
  ],
})
