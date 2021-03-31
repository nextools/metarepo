import path from 'path'

const cache = new Map()

export const parseSpecifier = (specifier) => {
  if (cache.has(specifier)) {
    return cache.get(specifier)
  }

  const url = new URL(specifier, 'fake://')
  const result = {
    query: url.search,
    pathname: url.pathname,
    hash: url.hash,
    ext: path.extname(url.pathname),
  }

  cache.set(specifier, result)

  return result
}
