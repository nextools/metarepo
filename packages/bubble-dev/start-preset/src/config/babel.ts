import { TransformOptions as BabelConfig } from '@babel/core'
// @ts-ignore
import babelPresetReactNative from 'metro-react-native-babel-preset'
import { browsersList } from '@bubble-dev/browsers-list'

const babelPresetReactNativeNoCompact = (...args: any[]) => ({
  ...babelPresetReactNative(...args),
  compact: false,
})

const node = '8.6.0'

const babelConfigCommon: BabelConfig = {
  babelrc: false,
  shouldPrintComment: (val: string) => val.startsWith('#'),
}
const presets = [
  require.resolve('@babel/preset-react'),
  require.resolve('@babel/preset-typescript'),
]
const plugins = [
  [
    require.resolve('@babel/plugin-transform-runtime'),
    {
      regenerator: false,
    },
  ],
  require.resolve('@babel/plugin-syntax-dynamic-import'),
  require.resolve('babel-plugin-dynamic-import-node'),
  require.resolve('@babel/plugin-syntax-bigint'),
]

export const babelConfigWeb: BabelConfig = {
  ...babelConfigCommon,
  sourceMaps: true,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { browsers: browsersList },
        modules: false,
      },
    ],
    ...presets,
  ],
  plugins,
}

export const babelConfigReactNative: BabelConfig = {
  ...babelConfigCommon,
  sourceMaps: true,
  presets: [babelPresetReactNativeNoCompact],
  plugins,
}

export const babelConfigNode: BabelConfig = {
  ...babelConfigCommon,
  sourceMaps: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node },
      },
    ],
    ...presets,
  ],
  plugins,
}
