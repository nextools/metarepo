import execa from 'execa'

export const getCommitMessages = async (): Promise<string[]> => {
  const { stdout } = await execa('git', ['log', '--pretty=format:%s'], {
    stderr: null,
  })

  return stdout.split('\n')
}
