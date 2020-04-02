import execa from 'execa'
import { isUndefined } from 'tsfn'

export type TUninstallIosAppOptions = {
  appId: string,
  deviceId?: string,
}

export const uninstallIosApp = async (options: TUninstallIosAppOptions): Promise<void> => {
  await execa(
    'xcrun',
    [
      'simctl',
      'uninstall',
      isUndefined(options.deviceId) ? 'booted' : options.deviceId,
      options.appId,
    ]
  )
}
