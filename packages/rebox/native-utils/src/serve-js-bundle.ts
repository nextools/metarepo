import execa from 'execa'
import { isUndefined } from 'tsfn'
// @ts-ignore
import isPortReachable from 'is-port-reachable'
import { waitTimePromise } from '@psxcode/wait'
import { TPlatform } from './types'

export type TServeJsBundleOptions = {
  entryPointPath: string,
  port?: number,
  isDev?: boolean,
  shouldMinify?: boolean,
}

export const serveJsBundle = (platform: TPlatform) => async (options: TServeJsBundleOptions) => {
  const port = isUndefined(options.port) ? 8081 : options.port
  const proc = execa(
    'haul',
    [
      'start',
      '--port',
      String(port),
      '--dev',
      isUndefined(options.isDev) ? 'true' : String(options.isDev),
      '--minify',
      isUndefined(options.shouldMinify) ? 'false' : String(options.shouldMinify),
      '--platform',
      platform,
      '--config',
      require.resolve('./haul.config.js'),
    ],
    {
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
        REBOX_ENTRY_POINT: options.entryPointPath,
      },
    }
  )

  while (!(await isPortReachable(port))) {
    await waitTimePromise(200)
  }

  return () => proc.kill()
}
