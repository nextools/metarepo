import { waitTimePromise } from '@psxcode/wait'
import execa from 'execa'
// @ts-ignore
import isPortReachable from 'is-port-reachable'
import fetch from 'node-fetch'
import { isUndefined } from 'tsfn'
import type { TPlatform } from './types'

const REQUEST_TIMEOUT = 2 * 60 * 1000

export type TServeNativeJsBundleOptions = {
  entryPointPath: string,
  port: number,
  platform: TPlatform,
  globalConstants?: {
    [key: string]: string,
  },
  globalAliases?: {
    [key: string]: string,
  },
  isDev?: boolean,
  shouldMinify?: boolean,
}

export const serveNativeJsBundle = async (options: TServeNativeJsBundleOptions): Promise<() => Promise<void>> => {
  const isDevString = isUndefined(options.isDev) ? 'true' : String(options.isDev)
  const shouldMinifyString = isUndefined(options.shouldMinify) ? 'false' : String(options.shouldMinify)

  const proc = execa(
    'haul',
    [
      'start',
      '--port',
      String(options.port),
      '--dev',
      isDevString,
      '--minify',
      shouldMinifyString,
      '--interactive',
      'false',
      '--eager',
      options.platform,
      '--config',
      require.resolve('./haul.config.js'),
    ],
    {
      env: {
        REBOX_ENTRY_POINT: options.entryPointPath,
        REBOX_GLOBAL_ALIASES: JSON.stringify(options.globalAliases),
        REBOX_GLOBAL_CONSTANTS: JSON.stringify(options.globalConstants),
      },
    }
  )

  while (!(await isPortReachable(options.port))) {
    await waitTimePromise(200)
  }

  await fetch(
    `http://localhost:${options.port}/index.bundle?platform=${options.platform}&dev=${isDevString}&minify=${shouldMinifyString}`,
    { timeout: REQUEST_TIMEOUT }
  )

  return () => proc.kill()
}
