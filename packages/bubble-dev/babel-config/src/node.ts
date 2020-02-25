import { TransformOptions as BabelConfig } from '@babel/core'
import { babelConfigCommon } from './common'

export const TARGET_NODE_VERSION = '10.13.0'

export const babelConfigNode: BabelConfig = {
  ...babelConfigCommon,
  shouldPrintComment: (val: string) => val.startsWith('#'),
  sourceMaps: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node: TARGET_NODE_VERSION },
        ignoreBrowserslistConfig: true,
        exclude: [
          '@babel/plugin-transform-regenerator',
          '@babel/plugin-transform-async-to-generator',
        ],
      },
    ],
    ...babelConfigCommon.presets,
  ],
  plugins: babelConfigCommon.plugins,
}
