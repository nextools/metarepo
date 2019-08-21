import { isUndefined } from 'tsfn'

type TDeviceList = {
  devices: {
    [k: string]: {
      name: string,
      udid: string,
      state: string,
    }[],
  },
}

export type TRunSimulatorOptions = {
  iPhoneVersion: number,
  iOSVersion: string,
  isHeadless: boolean,
}

export const runSimulator = async (options: TRunSimulatorOptions): Promise<() => void> => {
  const { default: execa } = await import('execa')
  const { stdout: xcrunList } = await execa('xcrun', ['simctl', 'list', '--json'])

  const devicesList = JSON.parse(xcrunList) as TDeviceList
  const devices = devicesList.devices[`com.apple.CoreSimulator.SimRuntime.iOS-${options.iOSVersion.replace('.', '-')}`]
  const deviceInfo = devices.find((device) => device.name === `iPhone ${options.iPhoneVersion}`)

  if (isUndefined(deviceInfo)) {
    throw new Error(`Unable to find iOS ${options.iOSVersion} + iPhone ${options.iPhoneVersion} Simulator`)
  }

  if (deviceInfo.state !== 'Booted') {
    await execa('xcrun', ['simctl', 'boot', deviceInfo.udid])
  }

  if (!options.isHeadless) {
    await execa('open', ['-a', 'Simulator', '--args', '-CurrentDeviceUDID', deviceInfo.udid])
  }

  return () => execa('xcrun', ['simctl', 'shutdown', deviceInfo.udid])
}
