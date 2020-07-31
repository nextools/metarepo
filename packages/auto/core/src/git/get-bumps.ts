import type { TReadonly } from 'tsfn'
import type { TGitMessageMap, TRequiredPrefixes, TMessage, TReleaseType } from '../types'
import { compareReleaseTypes } from '../utils'
import { parseCommitMessage } from './parse-commit-message'

const makeMessage = (type: TReleaseType, message: string, description?: string): TMessage<TReleaseType> => {
  const result: TMessage<TReleaseType> = {
    type,
    message,
  }

  if (typeof description === 'string') {
    result.description = description
  }

  return result
}

const sortMessages = <T extends TReleaseType>(messages: TMessage<T>[]): TMessage<T>[] => {
  return messages.sort((a, b) => compareReleaseTypes(b.type, a.type))
}

export const getBumps = (allPackageNames: readonly string[], prefixes: TReadonly<TRequiredPrefixes>, messages: readonly string[]): TGitMessageMap => {
  const bumps: TGitMessageMap = new Map()
  const completedPackages = new Set<string>()
  const parser = parseCommitMessage(allPackageNames, prefixes)

  for (const message of messages) {
    const parsed = parser(message)

    if (parsed === null) {
      continue
    }

    for (const name of parsed.names) {
      if (completedPackages.has(name)) {
        continue
      }

      if (parsed.type === 'dependencies') {
        continue
      }

      if (parsed.type === 'publish') {
        completedPackages.add(name)
        continue
      }

      if (parsed.type === 'initial') {
        bumps.set(name, [makeMessage(parsed.type, parsed.message, parsed.description)])

        completedPackages.add(name)
        continue
      }

      if (bumps.has(name)) {
        bumps.get(name)!.push(makeMessage(parsed.type, parsed.message, parsed.description))
      } else {
        bumps.set(name, [makeMessage(parsed.type, parsed.message, parsed.description)])
      }
    }

    if (allPackageNames.length === completedPackages.size) {
      break
    }
  }

  const bumpedNames = Array.from(bumps.keys())

  for (const name of bumpedNames) {
    bumps.set(name, sortMessages(bumps.get(name)!))
  }

  const incompletePackageNames = bumpedNames.filter((name) => !completedPackages.has(name))

  if (incompletePackageNames.length > 0) {
    throw new Error(`Cannot find initial or publish commits for "${incompletePackageNames.join('", "')}" packages`)
  }

  return bumps
}
