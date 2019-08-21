/* eslint-disable @typescript-eslint/no-require-imports, import/no-dynamic-require */
const { workerData } = require('worker_threads')
const babelRegister = require('@babel/register')

const { options, childFile } = workerData

global.navigator = {
  userAgent: 'x-ray',
}

const babelConfig = {
  babelrc: false,
  inputSourceMap: false,
  sourceMaps: false,
  compact: true,
  comments: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: 'current',
        },
        ignoreBrowserslistConfig: true,
        loose: true,
      },
    ],
    require.resolve('@babel/preset-react'),
    '@babel/preset-typescript',
  ],
  plugins: [
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-dynamic-import-node'),
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: options.mocks,
        extensions: options.extensions,
      },
    ],
  ],
  extensions: options.extensions,
}

babelRegister(babelConfig)

require(childFile).default(options)
