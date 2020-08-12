import path from 'path'
import { runIosApp } from '@rebox/ios'
import { runServer } from './run-server'

export type TGetIosViewCountOptions = {
  entryPointPath: string,
}

export const getIosViewCount = async (options: TGetIosViewCountOptions): Promise<number> => {
  const serverPromise = runServer()

  const closeAndroidApp = await runIosApp({
    entryPointPath: require.resolve('./App'),
    appName: 'Briew',
    appId: 'org.nextools.briew',
    iPhoneModel: '8',
    iOSVersion: '13',
    globalAliases: {
      __BRIEW_TARGET_APP_PATH__: path.resolve(options.entryPointPath),
    },
    isHeadless: true,
  })

  const result = await serverPromise

  await closeAndroidApp()

  return result
}
