import path from 'path'

export const getTarFilePath = (filePath: string, type: string): string => {
  const name = path.basename(filePath, '.tsx')

  return path.join(path.dirname(filePath), `${name}-${type}.tar.gz`)
}
