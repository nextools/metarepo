import path from 'path'
import { runAndroidApp } from '@rebox/android'
import { runServer } from './run-server'
import type { TGetPerfDataOptions, TPerfData } from './types'

export const getAndroidPerfData = async (options: TGetPerfDataOptions): Promise<TPerfData> => {
  const serverPromise = runServer()
  const dependencyNames = ['react-native-device-info']

  if (Array.isArray(options.dependencyNames)) {
    dependencyNames.push(...options.dependencyNames)
  }

  const closeAndroidApp = await runAndroidApp({
    entryPointPath: require.resolve('./App'),
    appName: 'Perfa',
    appId: 'org.nextools.perfa',
    portsToForward: [3005],
    dependencyNames,
    fontsDir: options.fontsDir,
    globalAliases: {
      __PERFA_TARGET_APP_PATH__: path.resolve(options.entryPointPath),
    },
    isHeadless: true,
  })

  const result = await serverPromise

  await closeAndroidApp()

  return result
}
