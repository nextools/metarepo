import { TPrefixes } from '@auto/utils'
import { TLog } from './types'

export const getMarkdownLog = (logs: TLog[], prefixes: TPrefixes): string => {
  let result = ''

  logs.forEach((log, index) => {
    if (index > 0) {
      result += '\n'
    }

    result += `## ${log.name} v${log.version}\n\n`

    log.messages.forEach((message) => {
      result += `* ${prefixes.required[message.type].value} ${message.value}\n`
    })
  })

  return result
}
