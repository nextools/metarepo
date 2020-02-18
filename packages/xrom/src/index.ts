import path from 'path'
import execa from 'execa'
import onExit from 'signal-exit'
import { isNumber, TRequireKeys, isArray, isString } from 'tsfn'
import fetch from 'node-fetch'
import { waitForChromium } from './wait-for-chromium'

const CHROMIUM_VERSION = 79
const DEBUGGER_ENDPOINT_HOST = 'localhost'
const DEBUGGER_ENDPOINT_PORT = 9222

export type TRunChromiumOptions = {
  containerName?: string,
  fontsDir?: string,
  mountVolumes?: {
    from: string,
    to: string,
  }[],
  cpus?: number,
  cpusetCpus?: number[],
  shouldCloseOnExit?: boolean,
}

export const runChromium = async (userOptions?: TRunChromiumOptions): Promise<string> => {
  const options: TRequireKeys<TRunChromiumOptions, 'containerName' | 'shouldCloseOnExit'> = {
    containerName: 'chromium-headless-remote',
    shouldCloseOnExit: false,
    ...userOptions,
  }

  if (options.shouldCloseOnExit) {
    onExit(() => {
      execa('docker', ['stop', options.containerName], {
        reject: false,
      })
    })
  }

  await execa('docker', ['stop', options.containerName], {
    reject: false,
  })

  await execa(
    'docker',
    [
      'run',
      '-d',
      '--rm',
      '-p',
      '9222:9222',
      isNumber(options.cpus) ? `--cpus=${options.cpus}` : '',
      isArray(options.cpusetCpus) ? `--cpuset-cpus=${options.cpusetCpus.join(',')}` : '',
      ...(isArray(options.mountVolumes)
        ? options.mountVolumes.reduce((acc, vol) =>
          acc.concat(
            '-v',
            `${path.resolve(vol.from)}:${vol.to}:delegated,ro`
          ),
        [] as string[])
        : []
      ),
      ...(isString(options.fontsDir)
        ? ['-v', `${path.resolve(options.fontsDir)}:/home/chromium/.fonts:delegated,ro`]
        : []
      ),
      '--name',
      options.containerName,
      `deepsweet/chromium-headless-remote:${CHROMIUM_VERSION}`,
    ],
    {
      reject: false,
    }
  )

  await waitForChromium()

  const response = await fetch(`http://${DEBUGGER_ENDPOINT_HOST}:${DEBUGGER_ENDPOINT_PORT}/json/version`)
  const { webSocketDebuggerUrl } = await response.json() as { webSocketDebuggerUrl: string }

  return webSocketDebuggerUrl
}
