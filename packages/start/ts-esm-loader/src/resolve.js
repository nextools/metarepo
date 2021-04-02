import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { promisify } from 'util'
import resolver from 'enhanced-resolve'
import { isTsSpecifier } from './is-ts-specifier.js'
import { parseSpecifier } from './parse-specifier.js'
import { tsExtensions } from './ts-extensions.js'

const resolveTs = promisify(
  resolver.create({
    extensions: tsExtensions,
    unsafeCache: true,
  })
)

export const resolve = async (specifier, context, defaultResolve) => {
  if (specifier.startsWith('.') && !isTsSpecifier(specifier)) {
    const parentDir = path.dirname(fileURLToPath(context.parentURL))
    const resolvedSpecifier = await resolveTs(parentDir, specifier)
    const { query: parentQuery } = parseSpecifier(context.parentURL)
    let url = pathToFileURL(resolvedSpecifier).href

    if (parentQuery.startsWith('?nocache=')) {
      url += `?nocache=${Date.now()}`
    }

    return { url }
  }

  return defaultResolve(specifier, context, defaultResolve)
}
