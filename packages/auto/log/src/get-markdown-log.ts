import { TPrefixes } from '@auto/utils'
import { isString } from 'tsfn'
import { TLog } from './types'

export const getMarkdownLog = (logs: TLog[], prefixes: TPrefixes): string => {
  let result = ''

  logs.forEach((log, index) => {
    if (index > 0) {
      result += '\n'
    }

    result += `## ${log.name} v${log.version}\n`

    log.messages.forEach((message) => {
      result += `\n* ${prefixes.required[message.type].value} ${message.value}\n`

      if (isString(message.description)) {
        result += `\n  ${message.description}\n`
      }
    })
  })

  return result
}
