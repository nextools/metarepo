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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      execa('docker', ['stop', options.containerName], {
        reject: false,
      })
    })
  }

  const stopProcess = await execa('docker', ['stop', `${options.containerName}`], {
    reject: false,
  })

  if (stopProcess.exitCode > 0 && !stopProcess.stderr.includes('No such container')) {
    throw new Error(stopProcess.stderr)
  }

  const dockerArgs = [
    'run',
    '-d',
    '--rm',
    '-p',
    '9222:9222',
  ]

  if (isArray(options.mountVolumes)) {
    for (const volume of options.mountVolumes) {
      dockerArgs.push('-v', `${path.resolve(volume.from)}:${volume.to}:delegated,ro`)
    }
  }

  if (isString(options.fontsDir)) {
    dockerArgs.push('-v', `${path.resolve(options.fontsDir)}:/home/chromium/.fonts:delegated,ro`)
  }

  dockerArgs.push(
    '--name',
    options.containerName,
    `deepsweet/chromium-headless-remote:${CHROMIUM_VERSION}`
  )

  await execa('docker', dockerArgs)

  await waitForChromium()

  const response = await fetch(`http://${DEBUGGER_ENDPOINT_HOST}:${DEBUGGER_ENDPOINT_PORT}/json/version`)
  const { webSocketDebuggerUrl } = await response.json() as { webSocketDebuggerUrl: string }

  return webSocketDebuggerUrl
}
