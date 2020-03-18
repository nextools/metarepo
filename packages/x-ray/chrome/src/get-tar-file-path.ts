import path from 'path'

export const getTarFilePath = (filePath: string): string => {
  return path.join(path.dirname(filePath), 'chrome-screenshots.tar.gz')
}
