import { waitTimePromise } from '@psxcode/wait'
import fetch from 'node-fetch'
import { isPortFree } from 'portu'
import { spawnChildProcessStream } from 'spown'
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
  const host = 'localhost'

  const proc = spawnChildProcessStream(
    `haul start --port ${String(options.port)} --dev ${isDevString} --minify ${shouldMinifyString} --interactive false --eager ${options.platform} --config ${require.resolve('./haul.config.js')}`,
    {
      stdout: null,
      stderr: null,
      env: {
        REBOX_ENTRY_POINT: options.entryPointPath,
        REBOX_GLOBAL_ALIASES: JSON.stringify(options.globalAliases),
        REBOX_GLOBAL_CONSTANTS: JSON.stringify(options.globalConstants),
      },
    }
  )

  while (await isPortFree(options.port, host)) {
    await waitTimePromise(200)
  }

  await fetch(
    `http://${host}:${options.port}/index.bundle?platform=${options.platform}&dev=${isDevString}&minify=${shouldMinifyString}`,
    { timeout: REQUEST_TIMEOUT }
  )

  return () => new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    proc.on('close', () => resolve())
    proc.kill()
  })
}
