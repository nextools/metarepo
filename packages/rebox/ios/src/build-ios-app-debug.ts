import os from 'os'
import path from 'path'
import { promisify } from 'util'
import copie from 'copie'
import { makeDir } from 'dirdir'
import dleet from 'dleet'
import fastGlob from 'fast-glob'
// @ts-ignore
import simplePlist from 'simple-plist'
import { spawnChildProcess } from 'spown'
import { getIosAppPath } from './get-ios-app-path'

const pPlistRead = promisify(simplePlist.readFile)
const pPlistWrite = promisify(simplePlist.writeFile)

export type TBuildIosAppDebugOptions = {
  projectPath: string,
  iOSVersion: string,
  platformName: string,
  appName: string,
  appId: string,
}

export const buildIosAppDebug = async (options: TBuildIosAppDebugOptions): Promise<void> => {
  const derivedDataPath = path.join(os.tmpdir(), 'rebox')

  await spawnChildProcess('pod install', {
    cwd: options.projectPath,
    stdout: process.stdout,
    stderr: process.stderr,
  })

  await dleet(derivedDataPath)
  await makeDir(derivedDataPath)

  await spawnChildProcess(
    `xcodebuild -workspace ${path.join(options.projectPath, 'rebox.xcworkspace')} -scheme rebox -configuration Debug CODE_SIGN_IDENTITY= CODE_SIGNING_ALLOWED=NO -destination "generic/platform=${options.platformName},OS=${options.iOSVersion}" clean build CONFIGURATION_BUILD_DIR=${derivedDataPath}`,
    {
      stdout: null,
      stderr: process.stderr,
      env: {
        RCT_METRO_PORT: '8082',
      },
    }
  )

  const originalAppPath = path.join(derivedDataPath, 'rebox.app')
  const newAppPath = getIosAppPath(options.appName)

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
