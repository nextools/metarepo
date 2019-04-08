import execa from 'execa'
import { TWorkspacesPackageBump } from '@auto/utils'

export const writeWorkspacesPublishTags = async (packageBumps: TWorkspacesPackageBump[]) => {
  for (const bump of packageBumps) {
    if (bump.version === null || bump.type === null) {
      continue
    }

    await execa(
      'git',
      [
        'tag',
        '-m',
        `${bump.name}@${bump.version}`,
        `${bump.name}@${bump.version}`,
      ],
      {
        stdout: null,
        stderr: null,
      }
    )
  }
}
