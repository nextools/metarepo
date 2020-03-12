import execa from 'execa'

export const getEditor = async (): Promise<string> => {
  const { stdout: gitEditor } = await execa('git', ['config', '--get', 'core.editor'])

  return gitEditor
}
