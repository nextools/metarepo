import execa from 'execa'
import { isUndefined } from 'tsfn'

export type TUninstallAppOptions = {
  appId: string,
  deviceId?: string,
}

export const uninstallAndroidApp = async (options: TUninstallAppOptions): Promise<void> => {
  await execa(
    'adb',
    [
      ...(isUndefined(options.deviceId) ? [] : ['-s', options.deviceId]),
      'uninstall',
      options.appId,
    ],
    {
      stdout: 'ignore',
      stderr: 'ignore',
      reject: false,
    }
  )
}
