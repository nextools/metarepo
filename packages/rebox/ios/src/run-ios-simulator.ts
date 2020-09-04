import execa from 'execa'
import { getIosSimulatorDevice } from './get-ios-simulator-device'

export type TRunIosSimulatorOptions = {
  iPhoneModel: string,
  iOSVersion: string,
  isHeadless?: boolean,
}

export const runIosSimulator = async (options: TRunIosSimulatorOptions): Promise<() => Promise<void>> => {
  const device = await getIosSimulatorDevice({
    iPhoneModel: options.iPhoneModel,
    iOSVersion: options.iOSVersion,
  })

  if (device === null) {
    throw new Error(`Unable to find iOS Simulator runtime for iPhone model "${options.iPhoneModel}" + iOS version "${options.iOSVersion}"`)
  }

  if (device.state !== 'Booted') {
    await execa('xcrun', ['simctl', 'boot', device.udid])
  }

  if (!options.isHeadless) {
    await execa('open', ['-a', 'Simulator', '--args', '-CurrentDeviceUDID', device.udid])
  }

  return async () => {
    await execa('xcrun', ['simctl', 'shutdown', device.udid])
  }
}
