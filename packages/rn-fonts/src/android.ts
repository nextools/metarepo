import path from 'path'
import copie from 'copie'
import makeDir from 'make-dir'
import { getFontPaths } from './utils'

export const addFontsAndroid = async (projectPath: string, fontsPath: string): Promise<void> => {
  const targetDir = path.join(projectPath, 'app/src/main/assets/fonts')
  const fontPaths = await getFontPaths(fontsPath)

  await makeDir(targetDir)

  for (const fontPath of fontPaths) {
    const targetPath = path.join(targetDir, path.basename(fontPath))

    await copie(fontPath, targetPath)
  }
}
