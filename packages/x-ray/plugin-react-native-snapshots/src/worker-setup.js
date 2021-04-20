require('@babel/register')({
  babelrc: false,
  compact: false,
  inputSourceMap: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node: 'current' },
        ignoreBrowserslistConfig: true,
      },
    ],
  ],
  plugins: [
    require.resolve('@babel/plugin-syntax-bigint'),
  ],
  overrides: [
    {
      test: /\.(ts|tsx)$/,
      presets: [
        require.resolve('@babel/preset-typescript'),
      ],
    },
    {
      test: /\.(ts|js)x$/,
      presets: [
        [
          require.resolve('@babel/preset-react'),
          { runtime: 'automatic' },
        ],
      ],
    },
  ],
  extensions: [
    '.ios.ts',
    '.android.ts',
    '.native.ts',
    '.ts',
    '.ios.tsx',
    '.android.tsx',
    '.native.tsx',
    '.tsx',
    '.ios.js',
    '.android.js',
    '.native.js',
    '.js',
    '.ios.jsx',
    '.android.jsx',
    '.native.jsx',
    '.jsx',
  ],
})

module.exports = require('./worker')
