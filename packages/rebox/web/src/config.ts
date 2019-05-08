import HTMLWebpackPlugin from 'html-webpack-plugin'
import { Configuration as WebpackConfig } from 'webpack'
import { Configuration as TWebpackDevServerConfig } from 'webpack-dev-server'

export type TWebpackConfig = WebpackConfig & {
  devServer?: TWebpackDevServerConfig,
}

const BROWSERS = ['last 2 versions', 'not ie <= 10']

export const getWebpackConfig = (entryPointPath: string, htmlTemplatePath: string): TWebpackConfig => ({
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
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                [
                  require.resolve('@babel/preset-env'),
                  {
                    targets: { browsers: BROWSERS },
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
