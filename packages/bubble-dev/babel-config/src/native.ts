import { TransformOptions as BabelConfig } from '@babel/core'
// @ts-ignore
import babelPresetReactNative from 'metro-react-native-babel-preset'
import { babelConfigCommon } from './common'

const babelPresetReactNativeNoCompact = (...args: any[]) => ({
  ...babelPresetReactNative(...args),
  compact: false,
})

export const babelConfigReactNative: BabelConfig = {
  ...babelConfigCommon,
  sourceMaps: true,
  presets: [babelPresetReactNativeNoCompact],
  plugins: babelConfigCommon.plugins,
}
