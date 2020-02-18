import execa from 'execa'
import { isUndefined } from 'tsfn'
// @ts-ignore
import isPortReachable from 'is-port-reachable'
import { waitTimePromise } from '@psxcode/wait'
import fetch from 'node-fetch'

const REQUEST_TIMEOUT = 2 * 60 * 1000

export type TServeJsBundleOptions = {
  entryPointPath: string,
  port: number,
  platform: 'ios' | 'android',
  isDev?: boolean,
  shouldMinify?: boolean,
}

export const serveJsBundle = async ({ port, entryPointPath, platform, isDev, shouldMinify }: TServeJsBundleOptions) => {
  const isDevString = isUndefined(isDev) ? 'true' : String(isDev)
  const shouldMinifyString = isUndefined(shouldMinify) ? 'false' : String(shouldMinify)

  const proc = execa(
    'haul',
    [
      'start',
      '--port',
      String(port),
      '--dev',
      isDevString,
      '--minify',
      shouldMinifyString,
      '--interactive',
      'false',
      '--eager',
      platform,
      '--config',
      require.resolve('./haul.config.js'),
    ],
    {
      env: {
        FORCE_COLOR: '1',
        REBOX_ENTRY_POINT: entryPointPath,
      },
    }
  )

  while (!(await isPortReachable(port))) {
    await waitTimePromise(200)
  }

  await fetch(
    `http://localhost:${port}/index.bundle?platform=${platform}&dev=${isDevString}&minify=${shouldMinifyString}`,
    { timeout: REQUEST_TIMEOUT }
  )

  return () => proc.kill()
}
