import { TPrefixes, makeRegExp, TWorkspacesOptions, removeAutoNamePrefix } from '@auto/utils'
import { TParsedMessageType, TParsedMessage } from './types'

export const parseCommitMessage = (commitText: string, packageNames: string[], prefixes: TPrefixes, { autoNamePrefix }: TWorkspacesOptions): TParsedMessage | null => {
  const matchResult = commitText.match(/^(.+?)\s(.+?):\s*([\s\S]*)$/)

  if (matchResult === null) {
    return null
  }

  const prefix = matchResult[1].trim()
  let type: TParsedMessageType | null = null

  switch (prefix) {
    case prefixes.required.major.value: {
      type = 'major'

      break
    }
    case prefixes.required.minor.value: {
      type = 'minor'

      break
    }
    case prefixes.required.patch.value: {
      type = 'patch'

      break
    }
    case prefixes.required.publish.value: {
      type = 'publish'

      break
    }
    case prefixes.required.initial.value: {
      type = 'initial'

      break
    }
    default: {
      return null
    }
  }

  const namesStr = matchResult[2].trim()
  const names = namesStr.split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0)
    .reduce((result, name) => {
      if (name.includes('*')) {
        const regExp = makeRegExp(name)
        const matchedNames = packageNames.filter((name) => regExp.test(name) || regExp.test(removeAutoNamePrefix(name, autoNamePrefix)))

        for (const matchedName of matchedNames) {
          if (!result.includes(matchedName)) {
            result.push(matchedName)
          }
        }

        return result
      }

      if (packageNames.includes(name)) {
        result.push(name)
      } else {
        const fullName = `${autoNamePrefix}${name}`

        if (packageNames.includes(fullName)) {
          result.push(fullName)
        }
      }

      return result
    }, [] as string[])

  const message = matchResult[3].trim()

  return {
    type,
    names,
    message,
  }
}
