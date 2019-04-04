const baseNameCache = new Map()

export const getBaseName = (name: string): string => {
  if (baseNameCache.has(name)) {
    return baseNameCache.get(name)
  }

  const result = name.split('__')[0]

  baseNameCache.set(name, result)

  return result
}

const getNameCount = (names: string[], baseName: string) =>
  names.reduce((result, name) => {
    return getBaseName(name) === baseName ? result + 1 : result
  }, 0)

export const getIndexedName = (names: string[], name: string): string => `${name}__${getNameCount(names, name)}`

const indexedNamesCache = new WeakMap()

export const makeIndexedNames = (names: string[]): string[] => {
  if (indexedNamesCache.has(names)) {
    return indexedNamesCache.get(names)
  }

  const result: string[] = []

  for (let i = 0; i < names.length; ++i) {
    result.push(getIndexedName(result, names[i]))
  }

  indexedNamesCache.set(names, result)

  return result
}
