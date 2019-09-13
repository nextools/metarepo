import execa from 'execa'
import { isUndefined } from 'tsfn'

export type TLaunchAppOptions = {
  appId: string,
  deviceId?: string,
}

export const launchApp = async (options: TLaunchAppOptions): Promise<void> => {
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
