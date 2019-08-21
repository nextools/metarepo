import path from 'path'
import os from 'os'
import { promisify } from 'util'
import execa from 'execa'
import { isUndefined } from 'tsfn'
import cpy from 'cpy'
import makeDir from 'make-dir'
import { readdir } from 'graceful-fs'
// @ts-ignore
import simplePlist from 'simple-plist'

const pReadDir = promisify(readdir)
const pPlistRead = promisify(simplePlist.readFile)
const pPlistWrite = promisify(simplePlist.writeFile)

export type TBuildDebugOptions = {
  projectPath: string,
  osVersion: string,
  platformName: string,
  appName: string,
  appId: string,
  outputPath: string,
}

export const buildDebug = async (options: TBuildDebugOptions) => {
  await execa(
    'xcodebuild',
    [
      '-project',
      path.join(options.projectPath, 'rebox.xcodeproj'),
      '-scheme',
      'rebox',
      '-configuration',
      'Debug',
      'CODE_SIGN_IDENTITY=""',
      'CODE_SIGNING_ALLOWED="NO"',
      '-destination',
      `generic/platform=${options.platformName},OS=${options.osVersion}`,
      'clean',
      'build',
    ],
    {
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
      },
    }
  )

  // TODO: https://stackoverflow.com/a/48889760
  const derivedDataPath = path.join(os.homedir(), 'Library', 'Developer', 'Xcode', 'DerivedData')
  const derivedDataFiles = await pReadDir(derivedDataPath)
  const derivedBuildPath = derivedDataFiles.find((file) => file.startsWith('rebox-'))

  if (isUndefined(derivedBuildPath)) {
    throw new Error('Unable to find Xcode product build directory')
  }

  const productsPath = path.join(derivedDataPath, derivedBuildPath, 'Build', 'Products')
  const productsFiles = await pReadDir(productsPath)
  const productReleaseName = productsFiles.find((file) => file.startsWith('Debug-'))

  if (isUndefined(productReleaseName)) {
    throw new Error('Unable to find Xcode product release directory')
  }

  const originalAppPath = path.join(productsPath, productReleaseName, 'rebox.app')
  const newAppPath = path.join(options.outputPath, `${options.appName}.app`)

  await makeDir(newAppPath)
  await cpy(`${originalAppPath}/**/*`, newAppPath)

  const plistPath = path.join(newAppPath, 'Info.plist')
  const plist = await pPlistRead(plistPath)

  plist.CFBundleDisplayName = options.appName
  plist.CFBundleName = options.appName
  plist.CFBundleIdentifier = options.appId

  await pPlistWrite(plistPath, plist)
}
