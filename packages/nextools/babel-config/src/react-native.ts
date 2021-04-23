import type { TransformOptions } from '@babel/core'
// @ts-expect-error
import babelPluginProposalObjectRestSpread from '@babel/plugin-proposal-object-rest-spread'
// @ts-expect-error
import babelPluginTransformDestructuring from '@babel/plugin-transform-destructuring'
// @ts-expect-error
import babelPluginTransformReactJsx from '@babel/plugin-transform-react-jsx'
import babelPluginTransformRuntime from '@babel/plugin-transform-runtime'
// @ts-expect-error
import metroReactNativeBabelPreset from 'metro-react-native-babel-preset'
import { babelPluginExt } from './babel-plugin-ext'

export const babelConfigBuildReactNative: TransformOptions = {
  babelrc: false,
  compact: false,
  sourceMaps: false,
  presets: [
    metroReactNativeBabelPreset,
  ],
  plugins: [
    babelPluginExt,
    babelPluginTransformRuntime,
    [
      babelPluginTransformReactJsx,
      { runtime: 'automatic' },
    ],
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
}
