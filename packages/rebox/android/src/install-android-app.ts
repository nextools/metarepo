import execa from 'execa'
import { isUndefined } from 'tsfn'

export type TInstallAndroidAppOptions = {
  appPath: string,
  deviceId?: string,
}

export const installAndroidApp = async (options: TInstallAndroidAppOptions): Promise<void> => {
  await execa(
    'adb',
    [
      ...(isUndefined(options.deviceId) ? [] : ['-s', options.deviceId]),
      'install',
      options.appPath,
    ],
    {
      stderr: process.stderr,
    }
  )
}
