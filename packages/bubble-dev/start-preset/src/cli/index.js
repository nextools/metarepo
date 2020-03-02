#!/bin/sh
':' //# comment; exec /usr/bin/env node --experimental-worker "$0" "$@"
// http://sambal.org/2014/02/passing-options-node-shebang-line/

require('dotenv/config')

require('@babel/register')({
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: 'current',
        },
      },
    ],
    require.resolve('@babel/preset-typescript'),
    require.resolve('@babel/preset-react'),
  ],
  plugins: [
    require.resolve('@babel/plugin-syntax-bigint'),
  ],
  extensions: [
    '.tsx',
    '.ts',
    '.js',
  ],
})

require('./cli')
