import path from 'path'
import type { SpawnError } from 'spown'
import { spawnChildProcess } from 'spown'
import { isArray, isString, isNumber, isError } from 'tsfn'
import type { TRequireKeys } from 'tsfn'
import { getDebuggerUrl } from './get-debugger-url'

export type TRunBrowserOptions = {
  browser: 'chromium' | 'firefox',
  version: string,
  dockerUrlRoot?: string
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

  try {
    await spawnChildProcess(`docker stop ${containerName}`, {
      stdout: null,
    })
  } catch (e) {
    if (isError<SpawnError>(e) && e.exitCode > 0 && !e.message.includes('No such container')) {
      throw e
    }
  }

  let cmd = `docker run -d --rm --shm-size=1g -p ${opts.port}:${opts.port} -e RD_PORT=${opts.port}`

  if (isArray(opts.mountVolumes)) {
    for (const volume of opts.mountVolumes) {
      cmd += ` -v ${path.resolve(volume.from)}:${volume.to}:delegated,ro`
    }
  }

  if (isString(opts.fontsDir)) {
    cmd += ` -v ${path.resolve(opts.fontsDir)}:/home/chromium/.fonts:delegated,ro`
  }

  if (isNumber(opts.cpus)) {
    cmd += ` --cpus=${opts.cpus}`
  }

  if (isArray(opts.cpusetCpus)) {
    cmd += ` --cpuset-cpus=${opts.cpusetCpus.join(',')}`
  }
  
  const dockerImageURL = `${opts.dockerUrlRoot || 'nextools'}/${opts.browser}:${opts.version}`

  cmd += ` --name ${containerName} ${dockerImageURL}`

  await spawnChildProcess(cmd, { stdout: null })

  const browserWSEndpoint = await getDebuggerUrl(opts.port)

  const closeBrowser = async () => {
    await spawnChildProcess(`docker stop ${containerName}`, { stdout: null })
  }

  return { browserWSEndpoint, closeBrowser }
}
