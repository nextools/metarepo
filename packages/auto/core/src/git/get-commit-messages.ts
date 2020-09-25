import { spawnChildProcess } from 'spown'

export const getCommitMessages = async (): Promise<string[]> => {
  const { stdout } = await spawnChildProcess(
    'git log --no-merges --format=---%B',
    { stderr: process.stderr }
  )

  return stdout
    .split('---')
    .map((msg) => msg.trim())
    .filter((msg) => msg.length > 0)
}
