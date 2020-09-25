import { spawnChildProcess } from 'spown'
import { isUndefined } from 'tsfn'

export type TUninstallIosAppOptions = {
  appId: string,
  deviceId?: string,
}

export const uninstallIosApp = async (options: TUninstallIosAppOptions): Promise<void> => {
  await spawnChildProcess(
    `xcrun simctl uninstall ${isUndefined(options.deviceId) ? 'booted' : options.deviceId} ${options.appId}`,
    {
      stdout: null,
      stderr: process.stderr,
    }
  )
}
