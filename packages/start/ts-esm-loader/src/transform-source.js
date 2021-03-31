import { fileURLToPath } from 'url'
import { transform } from '@babel/core'
import babelPluginSyntaxTopLevelAwait from '@babel/plugin-syntax-top-level-await'
import babelPresetEnv from '@babel/preset-env'
import babelPresetReact from '@babel/preset-react'
import babelPresetTypeScript from '@babel/preset-typescript'
import { isTsSpecifier } from './is-ts-specifier.js'
import { sourceMapsKey } from './source-maps-key.js'

export const transformSource = (source, context, defaultTransformSource) => {
  if (isTsSpecifier(context.url)) {
    const transformed = transform(source, {
      ast: false,
      babelrc: false,
      compact: false,
      inputSourceMap: false,
      sourceMaps: true,
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

    global[sourceMapsKey] = global[sourceMapsKey] ?? {}
    global[sourceMapsKey][context.url] = transformed.map

    return { source: transformed.code }
  }

  return defaultTransformSource(source, context, defaultTransformSource)
}
