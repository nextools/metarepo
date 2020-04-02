import execa from 'execa'
import { isUndefined } from 'tsfn'

export type TLaunchIosAppOptions = {
  appId: string,
  deviceId?: string,
}

export const launchIosApp = async (options: TLaunchIosAppOptions): Promise<void> => {
  await execa(
    'xcrun',
    [
      'simctl',
      'launch',
      isUndefined(options.deviceId) ? 'booted' : options.deviceId,
      options.appId,
    ]
  )
}
