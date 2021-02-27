import { fileURLToPath } from 'url'
import { transform } from '@babel/core'

const TS_EXTENSION = '.ts'

const resolve = async (specifier) => {
  const url = await import.meta.resolve(specifier)

  return fileURLToPath(url)
}

export const getFormat = (url, context, defaultGetFormat) => {
  if (url.endsWith(TS_EXTENSION)) {
    return { format: 'module' }
  }

  return defaultGetFormat(url, context, defaultGetFormat)
}

export const transformSource = async (source, context, defaultTransformSource) => {
  if (context.url.endsWith(TS_EXTENSION)) {
    const transformed = transform(source, {
      ast: false,
      babelrc: false,
      compact: false,
      inputSourceMap: false,
      // sourceMaps: 'inline',
      presets: [
        [
          await resolve('@babel/preset-env'),
          {
            targets: { node: 'current' },
            ignoreBrowserslistConfig: true,
            modules: false,
          },
        ],
      ],
      plugins: [
        await resolve('@babel/plugin-syntax-bigint'),
        await resolve('@babel/plugin-proposal-class-properties'),
        await resolve('@babel/plugin-proposal-private-methods'),
        await resolve('@babel/plugin-proposal-export-namespace-from'),
      ],
      overrides: [
        {
          test: /\.(ts|tsx)$/,
          presets: [
            await resolve('@babel/preset-typescript'),
          ],
        },
        {
          test: /\.(ts|js)x$/,
          presets: [
            await resolve('@babel/preset-react'),
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
