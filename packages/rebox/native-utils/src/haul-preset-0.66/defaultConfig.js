// hard-forked from https://github.com/callstack/haul/blob/master/packages/haul-preset-0.60/src/defaultConfig.ts
const os = require('os')
const path = require('path')
const {
  AssetResolver,
  HasteResolver,
  getBabelConfigPath,
  resolveModule,
  ASSET_LOADER_PATH,
} = require('@haul-bundler/core')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const isCi = require('is-ci')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

module.exports = function getDefaultConfig(runtime, env, bundleName, projectConfig) {
  const {
    entry: { entryFiles },
    platform,
    root,
    assetsDest,
    dev,
    minify,
    providesModuleNodeModules,
    hasteOptions,
    maxWorkers,
    type,
  } = projectConfig.bundles[bundleName]
  const { host, port } = projectConfig.server

  return {
    mode: dev === true ? 'development' : 'production',
    context: root,
    devtool: false,
    entry: entryFiles,
    output: {
      path: assetsDest ?? root,
      publicPath: `http://${host}:${port}/`,
      globalObject: 'this',
    },
    module: {
      rules: [
        { parser: { requireEnsure: false } },
        {
          test: /\.[jt]sx?$/,
          // eslint-disable-next-line no-useless-escape
          exclude: /node_modules(?!.*[\/\\](react|@react-navigation|@react-native-community|@expo|pretty-format|@haul-bundler|metro))/,
          use: [
            {
              loader: require.resolve(
                '@haul-bundler/core/build/webpack/loaders/babelWorkerLoader'
              ),
              options: {
                maxWorkers,
                extends: getBabelConfigPath(root),
                plugins: [
                  require.resolve(
                    '@haul-bundler/core/build/utils/fixRequireIssues'
                  ),
                ],
                /**
                 * to improve the rebuild speeds
                 * This enables caching results in ./node_modules/.cache/babel-loader/<platform>
                 * This is a feature of `babel-loader` and not babel
                 */
                cacheDirectory: dev === true
                  ? path.join(
                    root,
                    'node_modules',
                    '.cache',
                    'babel-loader',
                    platform
                  )
                  : false,
              },
            },
          ],
        },
        {
          test: AssetResolver.test,
          use: {
            /**
             * Asset loader enables asset management based on image scale
             * This needs the AssetResolver plugin in resolver.plugins to work
             */
            loader: ASSET_LOADER_PATH,
            options: {
              runtime,
              platform,
              root,
              bundle: env.bundleTarget === 'file',
            },
          },
        },
      ],
    },
    plugins: [
      /**
       * MacOS has a case insensitive filesystem
       * This is needed so we can error on incorrect case
       */
      new CaseSensitivePathsPlugin(),
      new webpack.DefinePlugin({
        /**
         * Various libraries like React rely on `process.env.NODE_ENV`
         * to distinguish between production and development
         */
        'process.env': {
          NODE_ENV: dev === true ? '"development"' : '"production"',
        },
        __DEV__: dev,
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: Boolean(minify),
        debug: dev,
      }),
      /**
       * All chunks will be combined into a single bundle anyway - so
       * combine all chunks into one to avoid creating other issues e.g.
       * https://github.com/callstack/haul/issues/701. They might otherwise
       * be created e.g. by calls to `import()`.
       */
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
    resolve: {
      plugins: [
        /**
         * React Native uses a module system called Haste
         * React Native uses haste internally, and additional RN
         * platform's require additional packages also provide haste modules
         */
        new HasteResolver({
          directories: providesModuleNodeModules.map((_) => {
            if (typeof _ === 'string') {
              if (_ === 'react-native') {
                return path.join(
                  resolveModule(root, 'react-native'),
                  'Libraries'
                )
              }

              return resolveModule(root, _)
            }

            return path.join(resolveModule(root, _.name), _.directory)
          }),
          hasteOptions: hasteOptions ?? {},
        }),
        /**
         * This is required by asset loader to resolve extra scales
         * It will resolve assets like image@1x.png when image.png is not present
         */
        new AssetResolver({ platform, runtime }),
      ],
      /**
       * Match what React Native packager supports.
       * First entry takes precedence.
       */
      mainFields: ['react-native', 'browser', 'main'],
      aliasFields: ['react-native', 'browser', 'main'],
      extensions: [
        `.${platform}.js`,
        `.${platform}.jsx`,
        '.native.js',
        '.native.jsx',
        '.js',
        '.jsx',
        `.${platform}.ts`,
        `.${platform}.tsx`,
        '.native.ts',
        '.native.tsx',
        '.ts',
        '.tsx',
      ],
    },
    optimization: {
      minimize: type === 'basic-bundle' ? Boolean(minify) : false,
      minimizer:
        type === 'basic-bundle'
          ? [
            new TerserWebpackPlugin({
              test: /\.(js|(js)?bundle)($|\?)/i,
              cache: true,
              // Set upper limit on CPU cores, to prevent Out of Memory exception on CIs.
              parallel: isCi === true ? Math.min(os.cpus().length, 8) - 1 : true,
              sourceMap: true,
            }),
          ]
          : [],
      namedModules: dev,
      concatenateModules: true,
    },
    // Webworker environment is the closes to RN's except for `importScripts`. Further customization
    // of the generated bundle can be done in `basic-bundle` or `ram-bundle` Webpack plugin.
    target: 'webworker',
    stats: 'verbose',
  }
}
