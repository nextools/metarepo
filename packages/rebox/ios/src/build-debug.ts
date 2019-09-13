import path from 'path'
import os from 'os'
import { promisify } from 'util'
import execa from 'execa'
import { isUndefined } from 'tsfn'
import makeDir from 'make-dir'
import { readdir } from 'pifs'
import fastGlob from 'fast-glob'
import copie from 'copie'
// @ts-ignore
import simplePlist from 'simple-plist'
import dleet from 'dleet'
import { getAppPath } from './get-app-path'

const pPlistRead = promisify(simplePlist.readFile)
const pPlistWrite = promisify(simplePlist.writeFile)

export type TBuildDebugOptions = {
  projectPath: string,
  iOSVersion: string,
  platformName: string,
  appName: string,
  appId: string,
}

export const buildDebug = async (options: TBuildDebugOptions) => {
  // TODO: https://stackoverflow.com/a/48889760
  const derivedDataPath = path.join(os.homedir(), 'Library', 'Developer', 'Xcode', 'DerivedData')
  let derivedDataFiles = await readdir(derivedDataPath)

  for (const dataFile of derivedDataFiles) {
    if (dataFile.startsWith('rebox-')) {
      await dleet(dataFile)
    }
  }

  await execa('pod', ['install', '--silent'], {
    cwd: options.projectPath,
    stderr: process.stderr,
  })

  await execa(
    'xcodebuild',
    [
      '-workspace',
      path.join(options.projectPath, 'rebox.xcworkspace'),
      '-scheme',
      'rebox',
      '-configuration',
      'Debug',
      'CODE_SIGN_IDENTITY=""',
      'CODE_SIGNING_ALLOWED="NO"',
      '-destination',
      `generic/platform=${options.platformName},OS=${options.iOSVersion}`,
      'clean',
      'build',
    ],
    {
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
        RCT_METRO_PORT: '8082',
      },
    }
  )

  derivedDataFiles = await readdir(derivedDataPath)
  const derivedBuildPath = derivedDataFiles.find((file) => file.startsWith('rebox-'))

  if (isUndefined(derivedBuildPath)) {
    throw new Error('Unable to find Xcode product build directory')
  }

  const productsPath = path.join(derivedDataPath, derivedBuildPath, 'Build', 'Products')
  const productsFiles = await readdir(productsPath)
  const productReleaseName = productsFiles.find((file) => file.startsWith('Debug-'))

  if (isUndefined(productReleaseName)) {
    throw new Error('Unable to find Xcode product release directory')
  }

  const originalAppPath = path.join(productsPath, productReleaseName, 'rebox.app')
  const newAppPath = getAppPath(options.appName)

  const files = await fastGlob(`${originalAppPath}/**/*`, {
    ignore: ['node_modules/**'],
    deep: Infinity,
    onlyFiles: true,
    absolute: true,
  })

  for (const file of files) {
    const outFile = path.join(newAppPath, path.relative(originalAppPath, file))
    const outDir = path.dirname(outFile)

    await makeDir(outDir)
    await copie(file, outFile)
  }

  const plistPath = path.join(newAppPath, 'Info.plist')
  const plist = await pPlistRead(plistPath)

  plist.CFBundleDisplayName = options.appName
  plist.CFBundleName = options.appName
  plist.CFBundleIdentifier = options.appId

  await pPlistWrite(plistPath, plist)
}
