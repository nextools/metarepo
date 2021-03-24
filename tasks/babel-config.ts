import type { TransformOptions } from '@babel/core'
import babelPluginSyntaxTopLevelAwait from '@babel/plugin-syntax-top-level-await'
import babelPresetEnv from '@babel/preset-env'
import babelPresetReact from '@babel/preset-react'
import babelPresetTypeScript from '@babel/preset-typescript'

const NODE_VERSION = '12.17.0'

export const babelConfigBuildNode: TransformOptions = {
  babelrc: false,
  compact: false,
  retainLines: true,
  sourceMaps: true,
  presets: [
    [
      babelPresetEnv,
      {
        targets: { node: NODE_VERSION },
        ignoreBrowserslistConfig: true,
        modules: false,
      },
    ],
  ],
  plugins: [
    babelPluginSyntaxTopLevelAwait,
    // '@babel/plugin-proposal-class-properties',
    // '@babel/plugin-proposal-private-methods',
    // '@babel/plugin-proposal-export-namespace-from',
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
  retainLines: true,
  sourceMaps: true,
  presets: [
    [
      babelPresetEnv,
      {
        targets: {
          browsers: 'last 2 Chrome versions',
        },
        ignoreBrowserslistConfig: true,
        modules: false,
      },
    ],
  ],
  plugins: [
    babelPluginSyntaxTopLevelAwait,
    // '@babel/plugin-proposal-class-properties',
    // '@babel/plugin-proposal-private-methods',
    // '@babel/plugin-proposal-export-namespace-from',
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
