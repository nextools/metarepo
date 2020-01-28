import path from 'path'
import { readFile, writeFile } from 'pifs'
import { TPrefixes } from '@auto/utils'
import { isString } from 'tsfn'
import { TLog } from './types'

export const writeChangelogFiles = async (logs: TLog[], prefixes: TPrefixes) => {
  for (const log of logs) {
    const changelogPath = path.join(log.dir, 'changelog.md')
    let newLog = `## v${log.version}\n\n`

    log.messages.forEach((message, index) => {
      newLog += `* ${prefixes.required[message.type].value} ${message.value}\n`

      if (isString(message.description)) {
        newLog += `\n  \`\`\`\n  ${message.description.replace(/\n/g, '\n  ')}\n  \`\`\`\n`
      }

      if (index < log.messages.length - 1) {
        newLog += '\n'
      }
    })

    try {
      const changelogData = await readFile(changelogPath, 'utf8')

      await writeFile(changelogPath, `${newLog}\n${changelogData}`, 'utf8')
    } catch (e) {
      await writeFile(changelogPath, newLog, 'utf8')
    }
  }
}
