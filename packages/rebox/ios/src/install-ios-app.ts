import { spawnChildProcess } from 'spown'
import { isUndefined } from 'tsfn'

export type TInstallIosAppOptions = {
  appPath: string,
  deviceId?: string,
}

export const installIosApp = async (options: TInstallIosAppOptions): Promise<void> => {
  await spawnChildProcess(
    `xcrun simctl install ${isUndefined(options.deviceId) ? 'booted' : options.deviceId} ${options.appPath}`,
    {
      stdout: null,
      stderr: process.stderr,
    }
  )
}
