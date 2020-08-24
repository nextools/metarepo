const PATH_DELIMITER = '__'

export const serializeElementPath = (path: readonly string[]): string => {
  return path.join(PATH_DELIMITER)
}

export const getElementPath = (serializedPath: string): readonly string[] => {
  return serializedPath === '' ? [] : serializedPath.split(PATH_DELIMITER)
}
