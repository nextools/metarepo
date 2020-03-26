import path from 'path'
import execa from 'execa'
import { THook } from '../types'

export const writePublishCommit = (): THook => async ({ packages, prefixes }) => {
  const bumps = packages.filter((pkg) => pkg.type !== null && pkg.version !== null)
  const names = bumps.map((pkg) => pkg.name).join(', ')
  const packageJsonPaths = bumps.map((pkg) => path.join(pkg.dir, 'package.json'))

  if (bumps.length === 0) {
    throw new Error('Cannot make publish commit, no packages to publish')
  }

  await execa(
    'git',
    [
      'add',
      ...packageJsonPaths,
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
