import execa from 'execa'
import { isUndefined } from 'tsfn'
// @ts-ignore
import isPortReachable from 'is-port-reachable'
import { waitTimePromise } from '@psxcode/wait'

export type TServeJsBundleOptions = {
  entryPointPath: string,
  port: number,
  isDev?: boolean,
  shouldMinify?: boolean,
}

export const serveJsBundle = async (options: TServeJsBundleOptions) => {
  const proc = execa(
    'haul',
    [
      'start',
      '--port',
      String(options.port),
      '--dev',
      isUndefined(options.isDev) ? 'true' : String(options.isDev),
      '--minify',
      isUndefined(options.shouldMinify) ? 'false' : String(options.shouldMinify),
      '--interactive',
      'false',
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

  return () => proc.kill()
}
