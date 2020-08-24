import execa from 'execa'
import type { THook } from '../types'

export const pushCommitsAndTags = (): THook => async () => {
  await execa(
    'git',
    [
      'push',
      '--quiet',
      '--follow-tags',
    ],
    {
      stdout: 'ignore',
      stderr: process.stderr,
    }
  )
}
