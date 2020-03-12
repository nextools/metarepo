import execa from 'execa'
import { THook } from '../types'

export const pushCommitsAndTags = (): THook => async () => {
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
