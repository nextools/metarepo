import execa from 'execa'
import { TRepoPackageBump } from '@auto/utils'

export const writeRepoPublishTag = async (packageBump: TRepoPackageBump) => {
  await execa(
    'git',
    [
      'tag',
      '-m',
      `v${packageBump.version}`,
      `v${packageBump.version}`,
    ],
    {
      stdout: null,
      stderr: null,
    }
  )
}
