import path from 'path'
import execa from 'execa'
import { isArray, isString, TRequireKeys, isNumber } from 'tsfn'
import { getDebuggerUrl } from './get-debugger-url'

export type TRunBrowserOptions = {
  browser: 'chromium' | 'firefox',
  version: string,
  port?: number,
  fontsDir?: string,
  mountVolumes?: {
    from: string,
    to: string,
  }[],
  cpus?: number,
  cpusetCpus?: number[],
}

export type TRunBrowserResult = {
  browserWSEndpoint: string,
  closeBrowser: () => Promise<void>,
}

export const runBrowser = async (options: TRunBrowserOptions): Promise<TRunBrowserResult> => {
  const opts: TRequireKeys<TRunBrowserOptions, 'port'> = {
    port: 9222,
    ...options,
  }
  const containerName = `xrom-${opts.browser}`

  const stopProcess = await execa('docker', ['stop', containerName], {
    stdout: 'ignore',
    reject: false,
  })

  if (stopProcess.exitCode > 0 && !stopProcess.stderr.includes('No such container')) {
    throw new Error(stopProcess.stderr)
  }

  const args = [
    'run',
    '-d',
    '--rm',
    '-p',
    `${opts.port}:${opts.port}`,
    '-e',
    `RD_PORT=${opts.port}`,
  ]

  if (isArray(opts.mountVolumes)) {
    for (const volume of opts.mountVolumes) {
      args.push('-v', `${path.resolve(volume.from)}:${volume.to}:delegated,ro`)
    }
  }

  if (isString(opts.fontsDir)) {
    args.push('-v', `${path.resolve(opts.fontsDir)}:/home/chromium/.fonts:delegated,ro`)
  }

  if (isNumber(options.cpus)) {
    args.push(`--cpus=${options.cpus}`)
  }

  if (isArray(options.cpusetCpus)) {
    args.push(`--cpuset-cpus=${options.cpusetCpus.join(',')}`)
  }

  args.push(
    '--name',
    containerName,
    `nextools/${opts.browser}:${opts.version}`
  )

  await execa('docker', args)

  const browserWSEndpoint = await getDebuggerUrl(opts.port)

  const closeBrowser = async () => {
    await execa('docker', ['stop', containerName], {
      stdout: 'ignore',
    })
  }

  return { browserWSEndpoint, closeBrowser }
}
