import { spawnChildProcess } from 'spown'

export const getEditor = async (): Promise<string> => {
  const { stdout: gitEditor } = await spawnChildProcess(
    'git config --get core.editor',
    { stderr: process.stderr }
  )

  return gitEditor
}
