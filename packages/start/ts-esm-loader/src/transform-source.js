import { fileURLToPath } from 'url'
import { transform } from '@babel/core'
import babelPluginSyntaxTopLevelAwait from '@babel/plugin-syntax-top-level-await'
import babelPresetEnv from '@babel/preset-env'
import babelPresetReact from '@babel/preset-react'
import babelPresetTypeScript from '@babel/preset-typescript'
import { babelPluginShake } from '@nextools/babel-plugin-shake'
import { isTsSpecifier } from './is-ts-specifier.js'

const SOURCES_KEY = '@@start-transpiled-sources'

export const transformSource = (source, context, defaultTransformSource) => {
  if (isTsSpecifier(context.url)) {
    const filePath = fileURLToPath(context.url)
    const transformed = transform(source, {
      babelrc: false,
      compact: false,
      inputSourceMap: false,
      sourceMaps: 'inline',
      targets: { node: 'current' },
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
        babelPluginShake,
        babelPluginSyntaxTopLevelAwait,
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

    if (typeof global[SOURCES_KEY] !== 'undefined') {
      global[SOURCES_KEY][filePath] = transformed.code
    }

    return { source: transformed.code }
  }

  return defaultTransformSource(source, context, defaultTransformSource)
}
