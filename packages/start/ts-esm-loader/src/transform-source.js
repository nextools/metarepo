import { fileURLToPath } from 'url'
import { transform } from '@babel/core'
import babelPluginSyntaxTopLevelAwait from '@babel/plugin-syntax-top-level-await'
import babelPresetEnv from '@babel/preset-env'
import babelPresetReact from '@babel/preset-react'
import babelPresetTypeScript from '@babel/preset-typescript'
import { isTsSpecifier } from './is-ts-specifier.js'
import { sourcesKey } from './sources-key.js'

export const transformSource = (source, context, defaultTransformSource) => {
  if (isTsSpecifier(context.url)) {
    const filePath = fileURLToPath(context.url)
    const transformed = transform(source, {
        ast: false,
        babelrc: false,
        compact: false,
        retainLines: false,
        inputSourceMap: false,
        sourceMaps: 'inline',
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
        filename: filePath,
      })

    if (typeof global[sourcesKey] !== 'undefined') {
      global[sourcesKey][filePath] = transformed.code
    }

    return { source: transformed.code }
  }

  return defaultTransformSource(source, context, defaultTransformSource)
}
