import type { TransformOptions } from '@babel/core'

// had to explicitly include proposal plugins because Acorn (and therefore Webpack)
// is unable to parse Nullish Coalescing and Optional Chaining
//
// https://github.com/acornjs/acorn/pull/890
// https://github.com/acornjs/acorn/pull/891

export const getBabelConfigBuildRelease = (browsersList: string[] = ['defaults']): TransformOptions => ({
  babelrc: false,
  inputSourceMap: null,
  sourceMaps: true,
  compact: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          browsers: browsersList,
        },
        ignoreBrowserslistConfig: true,
        modules: false,
        include: [
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-proposal-optional-chaining',
        ],
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
    [
      require.resolve('babel-plugin-polyfill-corejs3'),
      {
        method: 'usage-global',
        targets: {
          browsers: browsersList,
        },
      },
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
        [
          require.resolve('@babel/preset-react'),
          { runtime: 'automatic' },
        ],
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
        },
        ignoreBrowserslistConfig: true,
        modules: false,
        include: [
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-proposal-optional-chaining',
        ],
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
        [
          require.resolve('@babel/preset-react'),
          { runtime: 'automatic' },
        ],
      ],
    },
  ],
  shouldPrintComment: (val) => val.startsWith(' webpackChunkName'),
})
