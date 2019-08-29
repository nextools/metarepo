import execa from 'execa'
import { isUndefined } from 'tsfn'

export type TLaunchAppOptions = {
  appId: string,
  deviceId?: string,
}

export const launchApp = async (options: TLaunchAppOptions): Promise<void> => {
  await execa(
    'adb',
    [
      ...(isUndefined(options.deviceId) ? [] : ['-s', options.deviceId]),
      'shell',
      'am',
      'start',
      '-n',
      `${options.appId}/com.rebox.MainActivity`,
    ],
    {
      stderr: process.stderr,
    }
  )
}
