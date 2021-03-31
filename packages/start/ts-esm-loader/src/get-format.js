import { isTsSpecifier } from './is-ts-specifier.js'

export const getFormat = (url, context, defaultGetFormat) => {
  if (isTsSpecifier(url)) {
    return { format: 'module' }
  }

  return defaultGetFormat(url, context, defaultGetFormat)
}
