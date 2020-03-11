import { access } from 'pifs'
import { isArray, isString, isFunction } from 'tsfn'
import { addFontsAndroid } from 'rn-fonts'
import { runEmulator } from './run-emulator'
import { serveJsBundle } from './serve-js-bundle'
import { buildDebug } from './build-debug'
import { installApp } from './install-app'
import { launchApp } from './launch-app'
import { uninstallApp } from './uninstall-app'
import { getProjectPath } from './get-project-path'
import { copyTemplate } from './copy-template'
import { linkDependency } from './link-dependency'
import { getAppPath } from './get-app-path'

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

export const run = async ({ appId, appName, entryPointPath, portsToForward, fontsDir, dependencyNames, logMessage, isHeadless }: TOptions): Promise<() => void> => {
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
      }

      log('dependencies have been installed')

      if (isString(fontsDir)) {
        await addFontsAndroid(projectPath, fontsDir)

        log('fonts have been added')
      }
    }

    await buildDebug({
      projectPath,
      appName,
      appId,
    })

    log('app has been built')
  }

  const killEmulator = await runEmulator({
    isHeadless,
    portsToForward: [PORT, ...portsToForward],
  })

  log('emulator has been launched')

  await uninstallApp({ appId })
  await installApp({ appPath })

  log('app has been installed')

  const killServer = await serveJsBundle({
    entryPointPath,
    port: PORT,
    platform: 'android',
  })

  log('bundle has been served')

  await launchApp({ appId })

  log('app has been launched')

  return () => {
    killServer()
    killEmulator()
  }
}
