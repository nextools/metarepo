import path from 'path'

export const getTarFilePath = (filePath: string): string => {
  const name = path.basename(filePath, '.tsx')

  return path.join(path.dirname(filePath), `${name}-chrome-screenshots.tar.gz`)
}
