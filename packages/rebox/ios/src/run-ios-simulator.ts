import { spawnChildProcess } from 'spown'
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
    await spawnChildProcess(`xcrun simctl boot ${device.udid}`, {
      stdout: null,
      stderr: process.stderr,
    })
  }

  if (options.isHeadless !== true) {
    await spawnChildProcess(`open -a Simulator --args -CurrentDeviceUDID ${device.udid}`, {
      stdout: null,
      stderr: process.stderr,
    })
  }

  return async () => {
    await spawnChildProcess(`xcrun simctl shutdown ${device.udid}`, {
      stdout: null,
      stderr: process.stderr,
    })
  }
}
