import execa from 'execa'

export const getCommitMessages = async (): Promise<string[]> => {
  const { stdout } = await execa(
    'git',
    [
      'log',
      '--no-merges',
      '--format=---%B',
    ], {
      stderr: 'ignore',
    }
  )

  return stdout
    .split('---')
    .map((msg) => msg.trim())
    .filter((msg) => msg.length > 0)
}
