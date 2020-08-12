import path from 'path'
import { runAndroidApp } from '@rebox/android'
import { runServer } from './run-server'

export type TGetAndroidViewCountOptions = {
  entryPointPath: string,
}

export const getAndroidViewCount = async (options: TGetAndroidViewCountOptions): Promise<number> => {
  const serverPromise = runServer()

  const closeAndroidApp = await runAndroidApp({
    entryPointPath: require.resolve('./App'),
    appName: 'Briew',
    appId: 'org.nextools.briew',
    portsToForward: [3005],
    globalAliases: {
      __BRIEW_TARGET_APP_PATH__: path.resolve(options.entryPointPath),
    },
    isHeadless: true,
  })

  const result = await serverPromise

  await closeAndroidApp()

  return result
}
