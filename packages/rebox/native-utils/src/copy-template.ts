import path from 'path'
import { promisify } from 'util'
import { access } from 'graceful-fs'
import makeDir from 'make-dir'
import fastGlob from 'fast-glob'
import copie from 'copie'
import { TPlatform } from './types'

const pAccess = promisify(access)
const globbyOptions = {
  ignore: ['node_modules/**'],
  onlyFiles: true,
  absolute: true,
}

export const copyTemplate = (platform: TPlatform) => async (appName: string) => {
  const appPath = path.join('node_modules', '.rebox', appName, platform)

  try {
    await pAccess(appPath)
  } catch (e) {
    const templatePath = path.join(path.dirname(require.resolve(`@rebox/${platform}`)), '..', platform)
    const files = await fastGlob(`${templatePath}/**/*`, globbyOptions)

    for (const file of files) {
      const outFile = file.replace(templatePath, appPath)
      const outDir = path.dirname(outFile)

      await makeDir(outDir)
      await copie(file, outFile)
    }
  }

  return appPath
}
