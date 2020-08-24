import type { TReadonly } from 'tsfn'
import type { TPrefixReleaseType, TRequiredPrefixes } from '../types'
import { makeRegExp } from '../utils'

export type TParsedMessage = {
  names: string[],
  type: TPrefixReleaseType,
  message: string,
  description?: string,
}

const PARSE_REGEXP = /^(.+?)\s(.+?):\s([^\n]*)(?:\n\n)?(.*)$/s

const testName = (regexStr: string) => {
  const regExp = makeRegExp(regexStr)

  return (name: string): boolean => regExp.test(name)
}

const prefixToType = (prefixes: TReadonly<TRequiredPrefixes>) => (prefix: string): TPrefixReleaseType | null => {
  switch (prefix) {
    case prefixes.major:
      return 'major'
    case prefixes.minor:
      return 'minor'
    case prefixes.patch:
      return 'patch'
    case prefixes.initial:
      return 'initial'
    case prefixes.dependencies:
      return 'dependencies'
    case prefixes.publish:
      return 'publish'
    default:
      return null
  }
}

const getMatchedNames = (allNames: readonly string[]) => (names: readonly string[]): string[] => {
  return Array.from(
    names.map((name) => name.trim())
      .filter((name) => name.length > 0)
      .reduce((result, name) => {
        if (name.includes('*')) {
          const matchedNames = allNames.filter(testName(name))

          for (const name of matchedNames) {
            result.add(name)
          }

          return result
        }

        if (allNames.includes(name)) {
          result.add(name)

          return result
        }

        const fullName = `@${name}`

        if (allNames.includes(fullName)) {
          result.add(fullName)
        }

        return result
      }, new Set<string>())
  )
}

export const parseCommitMessage = (packageNames: readonly string[], prefixes: TReadonly<TRequiredPrefixes>) => {
  const matcher = getMatchedNames(packageNames)
  const prefixer = prefixToType(prefixes)

  return (commitText: string): TParsedMessage | null => {
    const matchResult = commitText.match(PARSE_REGEXP)

    if (matchResult === null) {
      return null
    }

    const type = prefixer(matchResult[1].trim())

    if (type === null) {
      return null
    }

    const namesStr = matchResult[2].trim()
    const names = matcher(namesStr.split(','))

    const message = matchResult[3].trim()
    const description = matchResult[4].trim()

    if (description.length > 0) {
      return {
        type,
        names,
        message,
        description,
      }
    }

    return {
      type,
      names,
      message,
    }
  }
}
