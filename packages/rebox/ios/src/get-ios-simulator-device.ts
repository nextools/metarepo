import { spawnChildProcess } from 'spown'

type TDevice = {
  udid: string,
  deviceTypeIdentifier: string,
  isAvailable: boolean,
  state: string,
}

type TDeviceList = {
  devices: {
    [k: string]: TDevice[],
  },
}

export type TGetIosSuimulatorDeviceOptions = {
  iPhoneModel: string,
  iOSVersion: string,
}

export const getIosSimulatorDevice = async (options: TGetIosSuimulatorDeviceOptions): Promise<TDevice | null> => {
  const iOSVersion = options.iOSVersion.replace('.', '-')
  const iPhoneModel = options.iPhoneModel.replace(' ', '-')
  const { stdout: xcrunList } = await spawnChildProcess('xcrun simctl list --json', { stderr: process.stderr })
  const devicesList = JSON.parse(xcrunList) as TDeviceList
  const devices = Object.entries(devicesList.devices)
    .filter((entry) =>
      entry[0].startsWith(`com.apple.CoreSimulator.SimRuntime.iOS-${iOSVersion}`) &&
      entry[1].some((value) => value.isAvailable))
    .sort((entryA, entryB) => (entryA[0] > entryB[0] ? -1 : 1))
    .map((entry) => entry[1])

  if (devices.length === 0) {
    return null
  }

  const device = devices[0].find((value) => value.deviceTypeIdentifier.startsWith(`com.apple.CoreSimulator.SimDeviceType.iPhone-${iPhoneModel}`))

  return device || null
}
