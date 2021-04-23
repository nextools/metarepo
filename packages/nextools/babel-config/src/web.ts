import type { TransformOptions } from '@babel/core'
// @ts-expect-error
import babelPluginProposalObjectRestSpread from '@babel/plugin-proposal-object-rest-spread'
// @ts-expect-error
import babelPluginTransformDestructuring from '@babel/plugin-transform-destructuring'
import babelPluginTransformRuntime from '@babel/plugin-transform-runtime'
import babelPresetEnv from '@babel/preset-env'
// @ts-expect-error
import babelPresetReact from '@babel/preset-react'
// @ts-expect-error
import babelPresetTypeScript from '@babel/preset-typescript'
import { browsersList } from '@nextools/browsers-list'
import { babelPluginExt } from './babel-plugin-ext'

export const babelConfigBuildWeb: TransformOptions = {
  babelrc: false,
  compact: false,
  sourceMaps: false,
  // @ts-expect-error
  targets: {
    browsers: browsersList,
  },
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
    babelPluginTransformRuntime,
    [
      babelPluginProposalObjectRestSpread,
      {
        useBuiltIns: true,
        loose: true,
      },
    ],
    [
      babelPluginTransformDestructuring,
      { useBuiltIns: true },
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
}
