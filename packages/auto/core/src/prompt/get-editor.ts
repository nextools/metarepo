import { spawnChildProcess } from 'spown'

export const getEditor = async (): Promise<string> => {
  const { stdout } = await spawnChildProcess(
    'git config --get core.editor',
    { stderr: process.stderr }
  )
  const gitEditor = stdout.trim()

  return gitEditor
}
