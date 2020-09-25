import { spawnChildProcess } from 'spown'
import { isUndefined } from 'tsfn'

export type TLaunchAndroidAppOptions = {
  appId: string,
  deviceId?: string,
}

export const launchAndroidApp = async (options: TLaunchAndroidAppOptions): Promise<void> => {
  await spawnChildProcess(
    `adb ${isUndefined(options.deviceId) ? '' : `-s ${options.deviceId}`} shell am start -n ${options.appId}/com.rebox.MainActivity`,
    {
      stdout: null,
      stderr: process.stderr,
    }
  )
}
