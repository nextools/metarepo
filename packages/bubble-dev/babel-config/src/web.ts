import { TransformOptions as BabelConfig } from '@babel/core'
import { browsersList } from '@bubble-dev/browsers-list'
import { babelConfigCommon } from './common'

export const babelConfigWebLib: BabelConfig = {
  ...babelConfigCommon,
  sourceMaps: true,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { browsers: browsersList },
        ignoreBrowserslistConfig: true,
        modules: false,
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

export const babelConfigWebApp: BabelConfig = {
  ...babelConfigCommon,
  shouldPrintComment: (val) => val.startsWith(' webpackChunkName'),
  sourceMaps: true,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { browsers: browsersList },
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
    ...babelConfigCommon.presets,
  ],
  plugins: babelConfigCommon.plugins,
}
