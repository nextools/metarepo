import { access } from 'pifs'
import { isArray, isString, isFunction } from 'tsfn'
import { addFontsAndroid } from 'rn-fonts'
import { copyNativeTemplate, serveNativeJsBundle } from '@rebox/native-utils'
import { runAndroidEmulator } from './run-android-emulator'
import { buildAndroidAppDebug } from './build-android-app-debug'
import { installAndroidApp } from './install-android-app'
import { uninstallAndroidApp } from './uninstall-android-app'
import { launchAndroidApp } from './launch-android-app'
import { getAndroidProjectPath } from './get-android-project-path'
import { getAndroidAppPath } from './get-android-app-path'
import { linkAndroidDependency } from './link-android-dependency'

const PORT = 8082

export type TRunAndroidAppOptions = {
  appName: string,
  appId: string,
  entryPointPath: string,
  portsToForward?: number[],
  fontsDir?: string,
  dependencyNames?: string[],
  isHeadless?: boolean,
  logMessage?: (msg: string) => void,
}

export const runAndroidApp = async (options: TRunAndroidAppOptions): Promise<() => void> => {
  const projectPath = getAndroidProjectPath(options.appName)
  const appPath = getAndroidAppPath(options.appName)
  const log = (message: string): void => {
    if (isFunction(options.logMessage)) {
      options.logMessage(message)
    }
  }

  try {
    await access(appPath)

    log('app build has been skipped')
  } catch {
    try {
      await access(projectPath)

      log('copying template, installing dependencies and adding fonts have been skipped')
    } catch {
      await copyNativeTemplate({
        platform: 'android',
        projectPath,
      })

      log('template has been copied')

      if (isArray(options.dependencyNames)) {
        for (const dependencyName of options.dependencyNames) {
          await linkAndroidDependency({
            projectPath,
            dependencyName,
          })
        }
      }

      log('dependencies have been installed')

      if (isString(options.fontsDir)) {
        await addFontsAndroid(projectPath, options.fontsDir)

        log('fonts have been added')
      }
    }

    await buildAndroidAppDebug({
      projectPath,
      appName: options.appName,
      appId: options.appName,
    })

    log('app has been built')
  }

  const killEmulator = await runAndroidEmulator({
    isHeadless: options.isHeadless,
    portsToForward: [PORT, ...options.portsToForward ?? []],
  })

  log('emulator has been launched')

  await uninstallAndroidApp({ appId: options.appName })
  await installAndroidApp({ appPath })

  log('app has been installed')

  const killServer = await serveNativeJsBundle({
    entryPointPath: options.entryPointPath,
    port: PORT,
    platform: 'android',
  })

  log('bundle has been served')

  await launchAndroidApp({ appId: options.appId })

  log('app has been launched')

  return () => {
    killServer()
    killEmulator()
  }
}
