import { compareMessageTypes, TGitBump, TPackageBump } from '@auto/utils'
import { TLog, TLogMessage } from './types'

const getMessages = (gitBumps: TGitBump[], name: string) => {
  for (const bump of gitBumps) {
    if (bump.name === name) {
      return bump.messages
    }
  }

  return []
}

export const getLog = (packageBumps: TPackageBump[], gitBumps: TGitBump[]): TLog[] => {
  return packageBumps.reduce((res, bump) => {
    if (bump.version === null || bump.type === null) {
      return res
    }

    const messages = getMessages(gitBumps, bump.name)

    if (bump.deps !== null) {
      return res.concat({
        name: bump.name,
        version: bump.version,
        type: bump.type,
        dir: bump.dir,
        messages: [
          ...messages.sort((a, b) => compareMessageTypes(b.type, a.type)),
          {
            type: 'dependencies',
            value: `upgrade dependencies: \`${Object.keys(bump.deps).join('`, `')}\``,
          } as TLogMessage,
        ],
      })
    }

    if (messages.length === 0) {
      return res
    }

    return res.concat({
      name: bump.name,
      version: bump.version,
      type: bump.type,
      dir: bump.dir,
      messages: messages.sort((a, b) => compareMessageTypes(b.type, a.type)),
    })
  }, [] as TLog[])
}
