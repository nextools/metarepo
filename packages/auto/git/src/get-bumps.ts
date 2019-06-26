import { compareReleaseTypes, TGitBump, TPackages, TPrefixes, TWorkspacesOptions } from '@auto/utils'
import { getCommitMessages } from './get-commit-messages'
import { parseCommitMessage } from './parse-commit-message'
import { TGitOptions } from './types'

type TGitBumps = {
  [key: string]: TGitBump,
}

export const getBumps = async (packages: TPackages, prefixes: TPrefixes, gitOptions: TGitOptions, workspacesOptions: TWorkspacesOptions): Promise<TGitBump[]> => {
  const messages = await getCommitMessages()
  const bumps: TGitBumps = {}
  const completedPackages: string[] = []
  const packageNames = Object.keys(packages)

  for (const message of messages) {
    const parsed = parseCommitMessage(message, packageNames, prefixes, workspacesOptions)

    if (parsed === null) {
      continue
    }

    for (const name of parsed.names) {
      if (completedPackages.includes(name)) {
        continue
      }

      if (parsed.type === 'publish') {
        completedPackages.push(name)
        continue
      }

      if (parsed.type === 'initial') {
        bumps[name] = {
          name,
          type: gitOptions.initialType,
          messages: [{
            type: parsed.type,
            value: parsed.message,
          }],
        }

        completedPackages.push(name)
        continue
      }

      if (Reflect.has(bumps, name)) {
        const bump = bumps[name]

        bump.messages.push({
          type: parsed.type,
          value: parsed.message,
        })

        if (compareReleaseTypes(parsed.type, bump.type) > 0) {
          bump.type = parsed.type
        }
      } else {
        bumps[name] = {
          name,
          type: parsed.type,
          messages: [{
            type: parsed.type,
            value: parsed.message,
          }],
        }
      }
    }

    if (packageNames.length === completedPackages.length) {
      break
    }
  }

  return Object.values(bumps)
}
