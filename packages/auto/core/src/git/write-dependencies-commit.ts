import path from 'path'
import { spawnChildProcess } from 'spown'
import type { THook } from '../types'

export const writeDependenciesCommit = (): THook => async ({ prefixes, packages }) => {
  const packageJsonPaths = packages
    .filter((pkg) => pkg.deps !== null || pkg.devDeps !== null)
    .map((pkg) => path.join(pkg.dir, 'package.json'))
    .join(' ')

  if (packageJsonPaths.length === 0) {
    return
  }

  await spawnChildProcess(
    `git add ${packageJsonPaths}`,
    {
      stdout: null,
      stderr: process.stderr,
    }
  )

  await spawnChildProcess(
    `git commit -m "${prefixes.dependencies} upgrade dependencies"`,
    {
      stdout: null,
      stderr: process.stderr,
    }
  )
}
