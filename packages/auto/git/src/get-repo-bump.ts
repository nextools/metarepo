import { compareReleaseTypes, TPrefixes, TRepoGitBump } from '@auto/utils'
import { getCommitMessages } from './get-commit-messages'
import { parseRepoCommitMessage } from './parse-repo-commit-message'
import { TGitOptions } from './types'

export const getRepoBump = async (prefixes: TPrefixes, options: TGitOptions): Promise<TRepoGitBump | null> => {
  const messages = await getCommitMessages()
  let bump: TRepoGitBump | null = null

  for (const message of messages) {
    const parsed = parseRepoCommitMessage(message, prefixes)

    if (parsed === null) {
      continue
    }

    if (parsed.type === 'publish') {
      break
    }

    if (parsed.type === 'initial') {
      if (bump !== null) {
        bump.messages.push({
          type: parsed.type,
          value: parsed.message,
        })

        bump.type = options.initialType
      } else {
        bump = {
          type: options.initialType,
          messages: [{
            type: parsed.type,
            value: parsed.message,
          }],
        }
      }

      break
    }

    if (bump !== null) {
      bump.messages.push({
        type: parsed.type,
        value: parsed.message,
      })

      if (compareReleaseTypes(parsed.type, bump.type) > 0) {
        bump.type = parsed.type
      }
    } else {
      bump = {
        type: parsed.type,
        messages: [{
          type: parsed.type,
          value: parsed.message,
        }],
      }
    }
  }

  return bump
}
