import { TPrefixes } from '@auto/utils'
import { TWorkspacesLog } from './types'

export const getWorkspacesMarkdownLog = (logs: TWorkspacesLog[], prefixes: TPrefixes): string => {
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
