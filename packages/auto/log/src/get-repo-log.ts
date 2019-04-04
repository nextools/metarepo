import { compareMessageTypes, TRepoGitBump, TRepoPackageBump } from '@auto/utils'
import { TRepoLog } from './types'

export const getRepoLog = (packageBump: TRepoPackageBump, gitBump: TRepoGitBump): TRepoLog => ({
  version: packageBump.version,
  type: packageBump.type,
  messages: gitBump.messages.sort((a, b) => compareMessageTypes(b.type, a.type)),
})
