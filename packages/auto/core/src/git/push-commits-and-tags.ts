import { spawnChildProcess } from 'spown'
import type { THook } from '../types'

export const pushCommitsAndTags = (): THook => async () => {
  await spawnChildProcess(
    'git push --quiet --follow-tags',
    {
      stdout: null,
      stderr: process.stderr,
    }
  )
}
