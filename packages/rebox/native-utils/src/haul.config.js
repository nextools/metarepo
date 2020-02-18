import path from 'path'
import { makeConfig, withPolyfills } from '@haul-bundler/preset-0.60'

const appPath = path.resolve(process.env.REBOX_ENTRY_POINT)

export default makeConfig({
  bundles: {
    index: {
      entry: withPolyfills(appPath),
      transform({ env, config }) {
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
            test: /\.(js|ts)x?$/,
            include: [
              path.resolve('node_modules/react-native/'),
              path.resolve('node_modules/metro/'),
              path.resolve('node_modules/react-devtools-core/'),
              path.resolve('node_modules/react-native-svg/'),
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
            test: /\.(ts|js)x?$/,
            exclude: path.resolve('node_modules/'),
            use: [
              {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: false,
                  presets: [
                    require.resolve('metro-react-native-babel-preset'),
                  ],
                  plugins: [
                    require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
                    require.resolve('@babel/plugin-proposal-optional-chaining'),
                    require.resolve('@babel/plugin-syntax-bigint'),
                  ],
                  cacheDirectory: true,
                },
              },
            ],
          },
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
    },
  },
})
