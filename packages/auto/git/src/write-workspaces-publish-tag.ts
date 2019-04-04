import execa from 'execa'
import { TWorkspacesPackageBump } from '@auto/utils'

export const writeWorkspacesPublishTag = async (packageBump: TWorkspacesPackageBump) => {
  if (packageBump.type !== null && packageBump.version !== null) {
    await execa(
      'git',
      [
        'tag',
        '-m',
        `${packageBump.name}@${packageBump.version}`,
        `${packageBump.name}@${packageBump.version}`,
      ],
      {
        stdout: null,
        stderr: null,
      }
    )
  }
}
