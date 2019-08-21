import execa from 'execa'
import { isUndefined } from 'tsfn'

export type TInstallAppOptions = {
  appPath: string,
  deviceId?: string,
}

export const installApp = async (options: TInstallAppOptions): Promise<void> => {
  await execa(
    'adb',
    [
      ...(isUndefined(options.deviceId) ? [] : ['-s', options.deviceId]),
      'install',
      '-r',
      options.appPath,
    ],
    {
      stderr: process.stderr,
    }
  )
}
