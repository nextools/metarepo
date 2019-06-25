import path from 'path'
import execa from 'execa'
import { TPrefixes, TPackageBump } from '@auto/utils'

export const writeDependenciesCommit = async (packageBumps: TPackageBump[], prefixes: TPrefixes) => {
  const bumps = packageBumps.filter((bump) => bump.deps !== null || bump.devDeps !== null)
  const packageJsonPaths = bumps.map((bump) => path.join(bump.dir, 'package.json'))

  if (bumps.length > 0) {
    await execa(
      'git',
      [
        'commit',
        '-m',
        `${prefixes.required.dependencies.value} upgrade dependencies`,
        ...packageJsonPaths,
      ],
      {
        stdout: null,
        stderr: null,
      }
    )
  }
}
