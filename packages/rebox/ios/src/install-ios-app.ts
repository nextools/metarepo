import execa from 'execa'
import { isUndefined } from 'tsfn'

export type TInstallIosAppOptions = {
  appPath: string,
  deviceId?: string,
}

export const installIosApp = async (options: TInstallIosAppOptions): Promise<void> => {
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
