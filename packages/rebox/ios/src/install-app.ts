import execa from 'execa'
import { isUndefined } from 'tsfn'

export type TInstallAppOptions = {
  appPath: string,
  deviceId?: string,
}

export const installApp = async (options: TInstallAppOptions): Promise<void> => {
  await execa(
    'xcrun',
    [
      'simctl',
      'install',
      isUndefined(options.deviceId) ? 'booted' : options.deviceId,
      options.appPath,
    ]
  )
}
