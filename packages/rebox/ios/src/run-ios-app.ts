import { serveNativeJsBundle, copyNativeTemplate } from '@rebox/native-utils'
import { access } from 'pifs'
import { addFontsIos } from 'rn-fonts'
import { isArray, isString, isFunction } from 'tsfn'
import { buildIosAppDebug } from './build-ios-app-debug'
import { getIosAppPath } from './get-ios-app-path'
import { getIosProjectPath } from './get-ios-project-path'
import { installIosApp } from './install-ios-app'
import { launchIosApp } from './launch-ios-app'
import { linkIosDependency } from './link-ios-dependency'
import { runIosSimulator } from './run-ios-simulator'

const PORT = 8081

export type TRunIosOptions = {
  appName: string,
  appId: string,
  entryPointPath: string,
  iOSVersion: string,
  iPhoneVersion: number,
  fontsDir?: string,
  dependencyNames?: string[],
  isHeadless?: boolean,
  logMessage?: (msg: string) => void,
}

export const runIosApp = async (options: TRunIosOptions): Promise<() => Promise<void>> => {
  const projectPath = getIosProjectPath(options.appName)
  const appPath = getIosAppPath(options.appName)
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
        platform: 'ios',
        projectPath,
      })

      log('template has been copied')

      if (isArray(options.dependencyNames)) {
        for (const dependencyName of options.dependencyNames) {
          await linkIosDependency({
            projectPath,
            dependencyName,
          })
        }

        log('dependencies have been installed')
      }

      if (isString(options.fontsDir)) {
        await addFontsIos(projectPath, options.fontsDir)

        log('fonts have been added')
      }
    }

    await buildIosAppDebug({
      projectPath,
      iOSVersion: options.iOSVersion,
      platformName: 'iOS Simulator',
      appName: options.appName,
      appId: options.appId,
    })

    log('app has been built')
  }

  const killSimulator = await runIosSimulator({
    iOSVersion: options.iOSVersion,
    isHeadless: options.isHeadless,
    iPhoneVersion: options.iPhoneVersion,
  })

  log('simulator has been launched')

  await installIosApp({ appPath })

  log('app has been installed')

  const killServer = await serveNativeJsBundle({
    entryPointPath: options.entryPointPath,
    port: PORT,
    platform: 'ios',
  })

  log('bundle has been served')

  await launchIosApp({
    appId: options.appId,
  })

  log('app has been launched')

  return async () => {
    killServer()

    await killSimulator()
  }
}

