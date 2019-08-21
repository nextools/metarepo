import path from 'path'
import { createWebpackConfig } from 'haul'

export default {
  webpack: (env) => {
    const appPath = path.resolve(process.env.REBOX_ENTRY_POINT)
    const config = createWebpackConfig({
      entry: appPath,
    })(env)

    config.module.rules = [
      {
        test: appPath,
        use: [
          {
            loader: require.resolve('./loader.js'),
          },
        ],
      },
      {
        test: /\.js$/,
        include: [
          path.resolve('node_modules/react-native/'),
          path.resolve('node_modules/metro/'),
          path.resolve('node_modules/react-devtools-core/'),
          path.resolve('node_modules/react-hot-loader/'),
          path.resolve('node_modules/haul/node_modules/react-hot-loader/'),
        ],
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              presets: [
                require.resolve('metro-react-native-babel-preset'),
              ],
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: path.resolve('node_modules/'),
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              presets: [
                require.resolve('metro-react-native-babel-preset'),
                require.resolve('@babel/preset-typescript'),
              ],
              cacheDirectory: true,
            },
          },
        ],
      },
      ...config.module.rules,
    ]

    config.performance = {
      ...config.performance,
      hints: false,
    }

    if (process.env.NODE_ENV === 'production') {
      config.plugins = config.plugins.filter((plugin) => {
        if (!plugin.constructor) {
          return true
        }

        return plugin.constructor.name !== 'SourceMapDevToolPlugin'
      })
    }

    config.resolve.extensions = [
      ...config.resolve.extensions,
      `.${env.platform}.js`,
      `.${env.platform}.ts`,
      `.${env.platform}.tsx`,
      '.native.js',
      '.native.ts',
      '.native.tsx',
      '.ts',
      '.tsx',
    ]

    return config
  },
}
