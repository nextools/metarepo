#!/usr/bin/env node

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
