import path from 'path'
import makeDir from 'make-dir'
import fastGlob from 'fast-glob'
import copie from 'copie'
import { TPlatform } from './types'

export const copyTemplate = (platform: TPlatform) => async (appPath: string) => {
  const templatePath = path.join(path.dirname(require.resolve(`@rebox/${platform}`)), '..', platform)
  const files = await fastGlob(`${templatePath}/**/*`, {
    ignore: ['node_modules/**'],
    onlyFiles: true,
    absolute: true,
  })

  for (const file of files) {
    const outFile = file.replace(templatePath, appPath)
    const outDir = path.dirname(outFile)

    await makeDir(outDir)
    await copie(file, outFile)
  }
}
