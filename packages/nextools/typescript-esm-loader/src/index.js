import { fileURLToPath } from 'url'
import { transform } from '@babel/core'
// import { transformSync } from '@swc/core'
// import Visitor from '@swc/core/Visitor.js'

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
    // class MyPlugin extends Visitor.default {
    //   visitImportDeclaration(e) {
    //     console.log(e)

    //     return e
    //   }

    //   visitTsType(e) {
    //     return e
    //   }
    // }

    // const transformed = transformSync(source.toString(), {
    //   sourceMaps: false,
    //   isModule: true,
    //   env: {
    //     targets: {
    //       node: process.version.substring(1),
    //     },
    //   },
    //   jsc: {
    //     parser: {
    //       syntax: 'typescript',
    //       dynamicImport: true,
    //     },
    //   },
    //   plugin: (m) => new MyPlugin().visitProgram(m),
    //   filename: fileURLToPath(context.url),
    // })
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
        await resolve('./babel-plugin.cjs'),
        await resolve('@babel/plugin-syntax-top-level-await'),
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
