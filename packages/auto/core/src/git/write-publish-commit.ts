import path from 'path'
import { spawnChildProcess } from 'spown'
import type { THook } from '../types'

export const writePublishCommit = (): THook => async ({ packages, prefixes }) => {
  const bumps = packages.filter((pkg) => pkg.type !== null && pkg.version !== null)
  const names = bumps.map((pkg) => pkg.name).join(', ')
  const packageJsonPaths = bumps
    .map((pkg) => path.join(pkg.dir, 'package.json'))
    .join(' ')

  if (bumps.length === 0) {
    throw new Error('Cannot make publish commit, no packages to publish')
  }

  await spawnChildProcess(
    `git add ${packageJsonPaths}`,
    {
      stdout: null,
      stderr: process.stderr,
    }
  )

  await spawnChildProcess(
    `git commit -m "${prefixes.publish} ${names}: release"`,
    {
      stdout: null,
      stderr: process.stderr,
    }
  )
}
