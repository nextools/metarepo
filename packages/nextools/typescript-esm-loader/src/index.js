import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { promisify } from 'util'
import { transform } from '@babel/core'
import babelPluginSyntaxTopLevelAwait from '@babel/plugin-syntax-top-level-await'
import babelPresetEnv from '@babel/preset-env'
import babelPresetReact from '@babel/preset-react'
import babelPresetTypeScript from '@babel/preset-typescript'
import resolver from 'enhanced-resolve'

const EXTENSIONS = ['.ts', '.tsx']
const START_SOURCE_MAPS = '@@start-source-maps'

const isTsSpecifier = (specifier) => {
  const url = new URL(specifier, 'fake://')
  const ext = path.extname(url.pathname)

  return EXTENSIONS.includes(ext)
}

const resolveExt = promisify(
  resolver.create({
    extensions: EXTENSIONS,
    unsafeCache: true,
  })
)

export const resolve = async (specifier, context, defaultResolve) => {
  if (specifier.startsWith('.') && !isTsSpecifier(specifier)) {
    const dir = path.dirname(fileURLToPath(context.parentURL))
    const result = await resolveExt(dir, specifier)
    let url = pathToFileURL(result).href

    if (context.parentURL.endsWith('?nocache')) {
      url += `?u=${Date.now()}`
    }

    return { url }
  }

  return defaultResolve(specifier, context, defaultResolve)
}

export const getFormat = (url, context, defaultGetFormat) => {
  if (isTsSpecifier(url)) {
    return { format: 'module' }
  }

  return defaultGetFormat(url, context, defaultGetFormat)
}

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

    global[START_SOURCE_MAPS] = global[START_SOURCE_MAPS] ?? {}
    global[START_SOURCE_MAPS][context.url] = transformed.map

    return { source: transformed.code }
  }

  return defaultTransformSource(source, context, defaultTransformSource)
}
