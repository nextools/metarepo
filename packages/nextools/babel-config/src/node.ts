import type { TransformOptions } from '@babel/core'
// @ts-expect-error
import babelPluginSyntaxTopLevelAwait from '@babel/plugin-syntax-top-level-await'
import babelPluginTransformRuntime from '@babel/plugin-transform-runtime'
import babelPresetEnv from '@babel/preset-env'
// @ts-expect-error
import babelPresetReact from '@babel/preset-react'
// @ts-expect-error
import babelPresetTypeScript from '@babel/preset-typescript'
import { babelPluginShake } from '@nextools/babel-plugin-shake'
// @ts-expect-error
import babelPluginTransformInlineEnvironmentVariables from 'babel-plugin-transform-inline-environment-variables'
import { babelPluginExt } from './babel-plugin-ext'

const NODE_VERSION = '12.22.0'

export const babelConfigBuildNode: TransformOptions = {
  babelrc: false,
  compact: false,
  sourceMaps: false,
  // @ts-expect-error
  targets: { node: NODE_VERSION },
  presets: [
    [
      babelPresetEnv,
      {
        shippedProposals: true,
        modules: false,
      },
    ],
  ],
  plugins: [
    babelPluginExt,
    babelPluginShake,
    babelPluginTransformRuntime,
    babelPluginSyntaxTopLevelAwait,
    [
      babelPluginTransformInlineEnvironmentVariables,
      { include: ['BABEL_ENV'] },
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
        babelPresetReact,
        { runtime: 'automatic' },
      ],
    },
  ],
  shouldPrintComment: (val: string) => val.startsWith('#'),
}
