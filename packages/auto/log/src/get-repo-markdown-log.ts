import { TPrefixes } from '@auto/utils'
import { TRepoLog } from './types'

export const getRepoMarkdownLog = (log: TRepoLog, prefixes: TPrefixes): string => {
  let result = ''

  result += `## v${log.version}\n\n`

  log.messages.forEach((message) => {
    result += `* ${prefixes.required[message.type].value} ${message.value}\n`
  })

  return result
}
