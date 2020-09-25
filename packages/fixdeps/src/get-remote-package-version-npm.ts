import { spawnChildProcess } from 'spown'

export const getRemotePackageVersionNpm = async (packageName: string): Promise<string> => {
  const { stdout } = await spawnChildProcess(`npm info ${packageName} version`)

  if (stdout.length === 0) {
    throw new Error(`Cannot find package "${packageName}"`)
  }

  return stdout
}
