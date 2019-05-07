import path from 'path'
import { promisify } from 'util'
import { readdir, readFile, writeFile } from 'graceful-fs'

export const pReadDir = promisify(readdir)
export const pReadFile = promisify(readFile)
export const pWriteFile = promisify(writeFile)

export const getFontPaths = async (fontsPath: string) => {
  const files = await pReadDir(fontsPath)

  return files
    .filter((file) => path.extname(file) === '.ttf' || path.extname(file) === '.otf')
    .map((file) => path.join(fontsPath, file))
}
