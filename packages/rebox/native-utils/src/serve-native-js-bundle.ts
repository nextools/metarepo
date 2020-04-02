import execa from 'execa'
import { isUndefined } from 'tsfn'
// @ts-ignore
import isPortReachable from 'is-port-reachable'
import { waitTimePromise } from '@psxcode/wait'
import fetch from 'node-fetch'

const REQUEST_TIMEOUT = 2 * 60 * 1000

export type TServeNativeJsBundleOptions = {
  entryPointPath: string,
  port: number,
  platform: 'ios' | 'android',
  isDev?: boolean,
  shouldMinify?: boolean,
}

export const serveNativeJsBundle = async (options: TServeNativeJsBundleOptions): Promise<() => void> => {
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
        FORCE_COLOR: '1',
        REBOX_ENTRY_POINT: options.entryPointPath,
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
