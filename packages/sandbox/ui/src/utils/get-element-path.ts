const PATH_DELIMITER = '__'

const pathCache = new Map<string, readonly string[]>()

pathCache.set('', [])

export const serializeElementPath = (path: readonly string[]): string => {
  const serializedPath = path.join(PATH_DELIMITER)

  pathCache.set(serializedPath, path)

  return serializedPath
}

export const getElementPath = (serializedPath: string): readonly string[] => {
  if (pathCache.has(serializedPath)) {
    return pathCache.get(serializedPath)!
  }

  console.error(`path "${serializedPath}" was not serialized previosly`)

  return String(serializedPath).split(PATH_DELIMITER)
}
