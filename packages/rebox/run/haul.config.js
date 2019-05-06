import path from 'path'
import { createWebpackConfig } from 'haul'

const rootPkg = require(path.resolve('package.json'))
const entryPoint = path.resolve(rootPkg.rebox.entryPoint)

export default {
  webpack: (env) => {
    const config = createWebpackConfig({
      entry: require.resolve('./index.jsx'),
    })(env)

    config.resolve.alias = {
      ...config.resolve.alias,
      __REBOX_ENTRY_POINT__: entryPoint,
    }

    config.module.rules = [
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
