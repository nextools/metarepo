import { TransformOptions } from '@babel/core'

export const getBabelConfigBuildRelease = (browsersList?: string[]): TransformOptions => ({
  babelrc: false,
  inputSourceMap: null,
  sourceMaps: true,
  compact: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { browsers: browsersList ?? ['defaults'] },
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
        targets: { browsers: browsersList ?? ['last 1 Chrome version', 'last 1 Firefox version'] },
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
