import execa from 'execa'
import { THook } from '../types'

export const writePublishCommit = (): THook => async ({ packages, prefixes }) => {
  const names = packages
    .filter((pkg) => pkg.type !== null && pkg.version !== null)
    .map((pkg) => pkg.name).join(', ')

  if (names.length === 0) {
    throw new Error('Cannot make publish commit, no packages to publish')
  }

  await execa(
    'git',
    [
      'add',
      '-u',
    ],
    {
      stdout: 'ignore',
      stderr: process.stderr,
    }
  )

  await execa(
    'git',
    [
      'commit',
      '-m',
      `${prefixes.publish} ${names}: release`,
    ],
    {
      stdout: 'ignore',
      stderr: process.stderr,
    }
  )
}
