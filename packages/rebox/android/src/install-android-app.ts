import { spawnChildProcess } from 'spown'
import { isUndefined } from 'tsfn'

export type TInstallAndroidAppOptions = {
  appPath: string,
  deviceId?: string,
}

export const installAndroidApp = async (options: TInstallAndroidAppOptions): Promise<void> => {
  await spawnChildProcess(
    `adb ${isUndefined(options.deviceId) ? '' : `-s ${options.deviceId}`} install ${options.appPath}`,
    {
      stdout: null,
      stderr: process.stderr,
    }
  )
}
