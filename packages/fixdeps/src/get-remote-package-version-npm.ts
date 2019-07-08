import execa from 'execa'

export const getRemotePackageVersionNpm = async (packageName: string): Promise<string> => {
  const { stdout } = await execa(
    'npm',
    [
      'info',
      packageName,
      'version',
    ],
    {
      stdout: null,
      stderr: null,
    }
  )

  if (stdout.length === 0) {
    throw new Error(`Cannot find package "${packageName}"`)
  }

  return stdout
}
