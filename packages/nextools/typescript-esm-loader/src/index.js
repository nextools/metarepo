import { fileURLToPath } from 'url'
import { transform } from '@babel/core'
import babelPluginSyntaxTopLevelAwait from '@babel/plugin-syntax-top-level-await'
import babelPresetEnv from '@babel/preset-env'
import babelPresetReact from '@babel/preset-react'
import babelPresetTypeScript from '@babel/preset-typescript'
import babelPluginExt from './babel-plugin.cjs'

const TS_EXTENSION = '.ts'

export const getFormat = (url, context, defaultGetFormat) => {
  if (url.endsWith(TS_EXTENSION)) {
    return { format: 'module' }
  }

  return defaultGetFormat(url, context, defaultGetFormat)
}

export const transformSource = (source, context, defaultTransformSource) => {
  if (context.url.endsWith(TS_EXTENSION)) {
    const transformed = transform(source, {
      ast: false,
      babelrc: false,
      compact: false,
      inputSourceMap: false,
      // sourceMaps: 'inline',
      presets: [
        [
          babelPresetEnv,
          {
            targets: { node: 'current' },
            ignoreBrowserslistConfig: true,
            modules: false,
          },
        ],
      ],
      plugins: [
        babelPluginExt,
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
      shouldPrintComment: (val) => val.startsWith('#'),
      filename: fileURLToPath(context.url),
    })

    return { source: transformed.code }
  }

  return defaultTransformSource(source, context, defaultTransformSource)
}
