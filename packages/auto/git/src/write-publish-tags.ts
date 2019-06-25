import execa from 'execa'
import { TPackageBump, removeAutoNamePrefix, TWorkspacesOptions } from '@auto/utils'

export const writePublishTags = async (packageBumps: TPackageBump[], workspacesOptions: TWorkspacesOptions) => {
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
