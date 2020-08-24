import execa from 'execa'
import { isString } from 'tsfn'

export const getRemotePackageVersionNpm = async (packageName: string): Promise<string> => {
  const { stdout } = await execa(
    'npm',
    [
      'info',
      packageName,
      'version',
    ]
  )

  if (!isString(stdout) || stdout.length === 0) {
    throw new Error(`Cannot find package "${packageName}"`)
  }

  return stdout
}
