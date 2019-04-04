import path from 'path'
import execa from 'execa'
import { TPrefixes, TWorkspacesPackageBump } from '@auto/utils'

export const writeWorkspacesPublishCommit = async (packageBumps: TWorkspacesPackageBump[], prefixes: TPrefixes) => {
  const bumps = packageBumps.filter((bump) => bump.type !== null && bump.version !== null)
  const names = bumps.map((bump) => bump.name).join(', ')
  const packageJsonPaths = bumps.map((bump) => path.join(bump.dir, 'package.json'))

  if (bumps.length > 0) {
    await execa(
      'git',
      [
        'commit',
        '-m',
        `${prefixes.required.publish.value} ${names}: release`,
        ...packageJsonPaths,
      ],
      {
        stdout: null,
        stderr: null,
      }
    )
  }
}
