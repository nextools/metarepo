import { parseSpecifier } from './parse-specifier.js'
import { tsExtensions } from './ts-extensions.js'

export const isTsSpecifier = (specifier) => {
  const { ext } = parseSpecifier(specifier)

  return tsExtensions.includes(ext)
}
