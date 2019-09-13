import path from 'path'
import { access } from 'pifs'
import { isArray, isString } from 'tsfn'
import { addFontsIos } from 'rn-fonts'
import { serveJsBundle } from './serve-js-bundle'
import { buildDebug } from './build-debug'
import { runSimulator } from './run-simulator'
import { installApp } from './install-app'
import { launchApp } from './launch-app'
import { getProjectPath } from './get-project-path'
import { copyTemplate } from './copy-template'
import { linkDependency } from './link-dependency'

const PORT = 8081

export type TRunIosOptions = {
  appName: string,
  appId: string,
  entryPointPath: string,
  iOSVersion: string,
  fontsDir?: string,
  dependencyNames?: string[],
  isHeadless?: boolean,
}

export const run = async ({ entryPointPath, appName, appId, iOSVersion, fontsDir, dependencyNames, isHeadless }: TRunIosOptions) => {
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
      await addFontsIos(projectPath, fontsDir)
    }
  }

  const killServer = await serveJsBundle({
    entryPointPath,
    port: PORT,
  })

  const appPath = path.join(projectPath, `${appName}.app`)

  try {
    await access(appPath)
  } catch {
    await buildDebug({
      projectPath,
      iOSVersion,
      platformName: 'iOS Simulator',
      appName,
      appId,
    })
  }

  const killSimulator = await runSimulator({
    iOSVersion,
    iPhoneVersion: 8,
    isHeadless,
  })

  await installApp({ appPath })

  await launchApp({ appId })

  return () => {
    killServer()
    killSimulator()
  }
}

