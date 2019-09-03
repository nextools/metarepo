import execa from 'execa'

export const pushCommitsAndTags = async () => {
  await execa(
    'git',
    [
      'push',
      '--follow-tags',
    ],
    {
      stdout: 'ignore',
      stderr: 'ignore',
    }
  )
}
