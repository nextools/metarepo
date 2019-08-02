#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-commonjs */

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
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-dynamic-import-node'),
    require.resolve('@babel/plugin-syntax-bigint'),
  ],
  extensions: [
    '.tsx',
    '.ts',
    '.js',
  ],
})

require('./cli')
