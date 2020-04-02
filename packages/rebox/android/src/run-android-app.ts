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

export type TOptions = {
  appName: string,
  appId: string,
  entryPointPath: string,
  portsToForward: number[],
  fontsDir?: string,
  dependencyNames?: string[],
  isHeadless?: boolean,
  logMessage?: (msg: string) => void,
}

export const runAndroidApp = async ({ appId, appName, entryPointPath, portsToForward, fontsDir, dependencyNames, logMessage, isHeadless }: TOptions): Promise<() => void> => {
  const projectPath = getAndroidProjectPath(appName)
  const appPath = getAndroidAppPath(appName)
  const log = (message: string): void => {
    if (isFunction(logMessage)) {
      logMessage(message)
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

      if (isArray(dependencyNames)) {
        for (const dependencyName of dependencyNames) {
          await linkAndroidDependency({
            projectPath,
            dependencyName,
          })
        }
      }

      log('dependencies have been installed')

      if (isString(fontsDir)) {
        await addFontsAndroid(projectPath, fontsDir)

        log('fonts have been added')
      }
    }

    await buildAndroidAppDebug({
      projectPath,
      appName,
      appId,
    })

    log('app has been built')
  }

  const killEmulator = await runAndroidEmulator({
    isHeadless,
    portsToForward: [PORT, ...portsToForward],
  })

  log('emulator has been launched')

  await uninstallAndroidApp({ appId })
  await installAndroidApp({ appPath })

  log('app has been installed')

  const killServer = await serveNativeJsBundle({
    entryPointPath,
    port: PORT,
    platform: 'android',
  })

  log('bundle has been served')

  await launchAndroidApp({ appId })

  log('app has been launched')

  return () => {
    killServer()
    killEmulator()
  }
}
