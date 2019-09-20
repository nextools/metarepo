import path from 'path'
import { readdir } from 'pifs'

export const getFontPaths = async (fontsPath: string) => {
  const files = await readdir(fontsPath)

  return files
    .filter((file) => path.extname(file) === '.ttf' || path.extname(file) === '.otf')
    .map((file) => path.join(fontsPath, file))
}
