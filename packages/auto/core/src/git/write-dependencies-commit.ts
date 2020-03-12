import execa from 'execa'
import { THook } from '../types'

export const writeDependenciesCommit = (): THook => async ({ prefixes }) => {
  await execa(
    'git',
    [
      'add',
      '-u',
    ],
    {
      stdout: 'ignore',
      stderr: 'ignore',
    }
  )

  await execa(
    'git',
    [
      'commit',
      '-m',
      `${prefixes.dependencies} upgrade dependencies`,
    ],
    {
      stdout: 'ignore',
      stderr: 'ignore',
    }
  )
}
