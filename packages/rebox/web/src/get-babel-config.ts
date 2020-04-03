import { TransformOptions } from '@babel/core'

// have to use `node` target here becaue Acorn (and therefore Webpack)
// is unable to parse Nullish Coalescing and Optional Chaining
//
// excluding such plugins from babel-env doesn't work
//
// https://github.com/acornjs/acorn/pull/890
// https://github.com/acornjs/acorn/pull/891

export const getBabelConfigBuildRelease = (browsersList?: string[]): TransformOptions => ({
  babelrc: false,
  inputSourceMap: null,
  sourceMaps: true,
  compact: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          browsers: browsersList ?? ['defaults'],
          node: '10.13.0',
        },
        ignoreBrowserslistConfig: true,
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
        exclude: [
          '@babel/plugin-transform-regenerator',
          '@babel/plugin-transform-async-to-generator',
        ],
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      { regenerator: false },
    ],
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
        require.resolve('@babel/preset-react'),
      ],
    },
  ],
  shouldPrintComment: (val) => val.startsWith(' webpackChunkName'),
})

export const getBabelConfigRun = (browsersList?: string[]): TransformOptions => ({
  babelrc: false,
  inputSourceMap: null,
  sourceMaps: true,
  compact: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          browsers: browsersList ?? ['last 1 Chrome version', 'last 1 Firefox version'],
          node: 'current',
        },
        ignoreBrowserslistConfig: true,
        modules: false,
        exclude: [
          '@babel/plugin-transform-regenerator',
          '@babel/plugin-transform-async-to-generator',
        ],
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      { regenerator: false },
    ],
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
        require.resolve('@babel/preset-react'),
      ],
    },
  ],
  shouldPrintComment: (val) => val.startsWith(' webpackChunkName'),
})
