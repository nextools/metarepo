import { access } from 'pifs'
import { isArray, isString, isFunction } from 'tsfn'
import { addFontsIos } from 'rn-fonts'
import { serveJsBundle } from './serve-js-bundle'
import { buildDebug } from './build-debug'
import { runSimulator } from './run-simulator'
import { installApp } from './install-app'
import { launchApp } from './launch-app'
import { getProjectPath } from './get-project-path'
import { copyTemplate } from './copy-template'
import { linkDependency } from './link-dependency'
import { getAppPath } from './get-app-path'

const PORT = 8081

export type TRunIosOptions = {
  appName: string,
  appId: string,
  entryPointPath: string,
  iOSVersion: string,
  fontsDir?: string,
  dependencyNames?: string[],
  isHeadless?: boolean,
  logMessage?: (msg: string) => void,
}

export const run = async ({ entryPointPath, appName, appId, iOSVersion, fontsDir, dependencyNames, logMessage, isHeadless }: TRunIosOptions): Promise<() => void> => {
  const projectPath = getProjectPath(appName)
  const appPath = getAppPath(appName)
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
      await copyTemplate(projectPath)

      log('template has been copied')

      if (isArray(dependencyNames)) {
        for (const dependencyName of dependencyNames) {
          await linkDependency({
            projectPath,
            dependencyName,
          })
        }

        log('dependencies have been installed')
      }

      if (isString(fontsDir)) {
        await addFontsIos(projectPath, fontsDir)

        log('fonts have been added')
      }
    }

    await buildDebug({
      projectPath,
      iOSVersion,
      platformName: 'iOS Simulator',
      appName,
      appId,
    })

    log('app has been built')
  }

  const killSimulator = await runSimulator({
    iOSVersion,
    iPhoneVersion: 8,
    isHeadless,
  })

  log('simulator has been launched')

  await installApp({ appPath })

  log('app has been installed')

  const killServer = await serveJsBundle({
    entryPointPath,
    port: PORT,
    platform: 'ios',
  })

  log('bundle has been served')

  await launchApp({ appId })

  log('app has been launched')

  return () => {
    killServer()
    killSimulator()
  }
}

