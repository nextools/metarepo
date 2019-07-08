import execa from 'execa'

export const getLocalPackageVersionYarn = async (packageName: string): Promise<string | null> => {
  const { stdout } = await execa(
    'yarn',
    [
      'list',
      '--pattern',
      packageName,
    ],
    {
      stdout: null,
      stderr: null,
    }
  )

  const packageRegExp = new RegExp(` ${packageName}@(.+)$`)

  const matchedLines = stdout.split('\n')
    .map((line) => line.match(packageRegExp))
    .filter((match) => match !== null)

  if (matchedLines.length > 1) {
    throw new Error(`More than one version of "${packageName}" exists`)
  }

  if (matchedLines.length === 1) {
    const versionMatch = matchedLines[0] as RegExpMatchArray

    return versionMatch[1]
  }

  return null
}
