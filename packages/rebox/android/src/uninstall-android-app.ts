import { spawnChildProcess } from 'spown'
import { isUndefined } from 'tsfn'

export type TUninstallAndroidAppOptions = {
  appId: string,
  deviceId?: string,
}

export const uninstallAndroidApp = async (options: TUninstallAndroidAppOptions): Promise<void> => {
  try {
    await spawnChildProcess(
      `adb ${isUndefined(options.deviceId) ? '' : `-s ${options.deviceId}`} uninstall ${options.appId}`,
      {
        stdout: null,
        stderr: null,
      }
    )
  } catch {}
}
