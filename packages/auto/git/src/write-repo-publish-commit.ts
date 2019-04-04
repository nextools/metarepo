import path from 'path'
import execa from 'execa'
import { TPrefixes, TRepoPackageBump } from '@auto/utils'

export const writeRepoPublishCommit = async (packageBump: TRepoPackageBump, prefixes: TPrefixes) => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  await execa(
    'git',
    [
      'commit',
      '-m',
      `${prefixes.required.publish.value} v${packageBump.version}`,
      packageJsonPath,
    ],
    {
      stdout: null,
      stderr: null,
    }
  )
}
