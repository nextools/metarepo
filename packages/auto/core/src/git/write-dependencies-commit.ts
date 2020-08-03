import path from 'path'
import execa from 'execa'
import type { THook } from '../types'

export const writeDependenciesCommit = (): THook => async ({ prefixes, packages }) => {
  const packageJsonPaths = packages
    .filter((pkg) => pkg.deps !== null || pkg.devDeps !== null)
    .map((pkg) => path.join(pkg.dir, 'package.json'))

  if (packageJsonPaths.length === 0) {
    return
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
      `${prefixes.dependencies} upgrade dependencies`,
    ],
    {
      stdout: 'ignore',
      stderr: process.stderr,
    }
  )
}
