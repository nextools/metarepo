import { TPrefixes } from '@auto/utils'
import { TParsedMessageType, TRepoParsedMessage } from './types'

export const parseRepoCommitMessage = (message: string, prefixes: TPrefixes): TRepoParsedMessage | null => {
  const parsedPrefixes: [TParsedMessageType, string][] = [
    ['major', prefixes.required.major.value],
    ['minor', prefixes.required.minor.value],
    ['patch', prefixes.required.patch.value],
    ['publish', prefixes.required.publish.value],
    ['initial', prefixes.required.initial.value],
  ]

  for (const [type, value] of parsedPrefixes) {
    const regexp = new RegExp(`^${value}\\s((?:[\r\n]|.)+)$`, 'm')
    const result = message.match(regexp)

    if (result === null) {
      continue
    }

    return {
      type,
      message: result[1].trim(),
    }
  }

  return null
}
