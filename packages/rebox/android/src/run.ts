import path from 'path'
import { access } from 'pifs'
import { isArray, isString } from 'tsfn'
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

const PORT = 8082

export type TOptions = {
  appName: string,
  appId: string,
  entryPointPath: string,
  portsToForward: number[],
  fontsDir?: string,
  dependencyNames?: string[],
  isHeadless?: boolean,
}

export const run = async ({ appId, appName, entryPointPath, portsToForward, fontsDir, dependencyNames, isHeadless }: TOptions) => {
  const projectPath = getProjectPath(appName)

  try {
    await access(projectPath)
  } catch {
    await copyTemplate(projectPath)

    if (isArray(dependencyNames)) {
      for (const dependencyName of dependencyNames) {
        await linkDependency({
          projectPath,
          dependencyName,
        })
      }
    }

    if (isString(fontsDir)) {
      await addFontsAndroid(projectPath, fontsDir)
    }
  }

  const killServer = await serveJsBundle({
    entryPointPath,
    port: PORT,
  })

  const appPath = path.join(projectPath, `${appName}.apk`)

  try {
    await access(appPath)
  } catch {
    await buildDebug({
      projectPath,
      appName,
      appId,
    })
  }

  const killEmulator = await runEmulator({
    isHeadless,
    portsToForward: [PORT, ...portsToForward],
  })

  await uninstallApp({ appId })
  await installApp({ appPath })

  await launchApp({ appId })

  return () => {
    killServer()
    killEmulator()
  }
}
