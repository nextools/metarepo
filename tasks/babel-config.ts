import type { TransformOptions } from '@babel/core'
// @ts-expect-error
import babelPluginSyntaxTopLevelAwait from '@babel/plugin-syntax-top-level-await'
// @ts-expect-error
import babelPresetEnv from '@babel/preset-env'
// @ts-expect-error
import babelPresetReact from '@babel/preset-react'
// @ts-expect-error
import babelPresetTypeScript from '@babel/preset-typescript'
import { babelPluginExt } from './babel-plugin-ext'

const NODE_VERSION = '12.22.0'

export const babelConfigBuildNode: TransformOptions = {
  babelrc: false,
  compact: false,
  sourceMaps: false,
  presets: [
    [
      babelPresetEnv,
      {
        targets: { node: NODE_VERSION },
        shippedProposals: true,
        ignoreBrowserslistConfig: true,
        modules: false,
      },
    ],
  ],
  plugins: [
    babelPluginExt,
    babelPluginSyntaxTopLevelAwait,
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
        babelPresetReact,
      ],
    },
  ],
  shouldPrintComment: (val: string) => val.startsWith('#'),
}

export const babelConfigBuildWeb: TransformOptions = {
  babelrc: false,
  compact: false,
  sourceMaps: false,
  presets: [
    [
      babelPresetEnv,
      {
        targets: {
          browsers: 'last 2 Chrome versions',
        },
        shippedProposals: true,
        ignoreBrowserslistConfig: true,
        modules: false,
      },
    ],
  ],
  plugins: [
    babelPluginExt,
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
        babelPresetReact,
      ],
    },
  ],
}
