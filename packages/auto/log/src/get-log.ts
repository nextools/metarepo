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
  return packageBumps.reduce((result, bump) => {
    if (bump.version === null || bump.type === null) {
      return result
    }

    const messages = getMessages(gitBumps, bump.name)
    const initialMessage = messages.find((message) => message.type === 'initial')

    if (typeof initialMessage !== 'undefined') {
      return result.concat({
        name: bump.name,
        version: bump.version,
        type: bump.type,
        dir: bump.dir,
        messages: [initialMessage],
      })
    }

    if (bump.deps !== null) {
      return result.concat({
        name: bump.name,
        version: bump.version,
        type: bump.type,
        dir: bump.dir,
        messages: [
          ...messages.sort((a, b) => compareMessageTypes(b.type, a.type)),
          {
            type: 'dependencies',
            value: `update dependencies: \`${Object.keys(bump.deps).join('`, `')}\``,
          } as TLogMessage,
        ],
      })
    }

    if (messages.length === 0) {
      return result
    }

    return result.concat({
      name: bump.name,
      version: bump.version,
      type: bump.type,
      dir: bump.dir,
      messages: messages.sort((a, b) => compareMessageTypes(b.type, a.type)),
    })
  }, [] as TLog[])
}
