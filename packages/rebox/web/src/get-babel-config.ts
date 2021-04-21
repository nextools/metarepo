import type { TransformOptions } from '@babel/core'
import babelPluginTransformRuntime from '@babel/plugin-transform-runtime'
import babelPresetEnv from '@babel/preset-env'
// @ts-expect-error
import babelPresetReact from '@babel/preset-react'
// @ts-expect-error
import babelPresetTypeScript from '@babel/preset-typescript'
// @ts-expect-error
import babelPluginPolyfillCorejs from 'babel-plugin-polyfill-corejs3'

export const getBabelConfigBuildRelease = (browsersList: string[] = ['defaults']): TransformOptions => ({
  babelrc: false,
  inputSourceMap: null,
  sourceMaps: true,
  compact: false,
  // @ts-expect-error
  targets: {
    browsers: browsersList,
  },
  presets: [
    [
      babelPresetEnv,
      {
        modules: false,
        shippedProposals: true,
        exclude: [
          '@babel/plugin-transform-regenerator',
          '@babel/plugin-transform-async-to-generator',
        ],
      },
    ],
  ],
  plugins: [
    [
      babelPluginTransformRuntime,
      {
        regenerator: false,
      },
    ],
    [
      babelPluginPolyfillCorejs,
      {
        method: 'usage-global',
      },
    ],
  ],
  overrides: [
    {
      test: /\.(ts|tsx)$/,
      presets: [
        babelPresetTypeScript,
      ],
    },
    {
      test: /\.(ts|js)x$/,
      presets: [
        [
          babelPresetReact,
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
  // @ts-expect-error
  targets: {
    browsers: browsersList ?? ['last 1 Chrome version', 'last 1 Firefox version'],
  },
  presets: [
    [
      babelPresetEnv,
      {
        modules: false,
        shippedProposals: true,
        exclude: [
          '@babel/plugin-transform-regenerator',
          '@babel/plugin-transform-async-to-generator',
        ],
      },
    ],
  ],
  plugins: [
    [
      babelPluginTransformRuntime,
      { regenerator: false },
    ],
  ],
  overrides: [
    {
      test: /\.(ts|tsx)$/,
      presets: [
        babelPresetTypeScript,
      ],
    },
    {
      test: /\.(ts|js)x$/,
      presets: [
        [
          babelPresetReact,
          { runtime: 'automatic' },
        ],
      ],
    },
  ],
  shouldPrintComment: (val) => val.startsWith(' webpackChunkName'),
})
