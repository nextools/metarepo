import execa from 'execa'
import { TWorkspacesPackageBump, removeAutoNamePrefix, TWorkspacesOptions } from '@auto/utils'

export const writeWorkspacesPublishTags = async (packageBumps: TWorkspacesPackageBump[], workspacesOptions: TWorkspacesOptions) => {
  for (const bump of packageBumps) {
    if (bump.version === null || bump.type === null) {
      continue
    }

    const name = removeAutoNamePrefix(bump.name, workspacesOptions.autoNamePrefix)

    await execa(
      'git',
      [
        'tag',
        '-m',
        `${name}@${bump.version}`,
        `${name}@${bump.version}`,
      ],
      {
        stdout: null,
        stderr: null,
      }
    )
  }
}
