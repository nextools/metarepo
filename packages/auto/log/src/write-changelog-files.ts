import path from 'path'
import { readFile, writeFile } from 'pifs'
import { TPrefixes } from '@auto/utils'
import { TLog } from './types'

export const writeChangelogFiles = async (logs: TLog[], prefixes: TPrefixes) => {
  for (const log of logs) {
    const changelogPath = path.join(log.dir, 'changelog.md')
    let newLog = `## v${log.version}\n\n`

    log.messages.forEach((message) => {
      newLog += `* ${prefixes.required[message.type].value} ${message.value}\n`
    })

    try {
      const changelogData = await readFile(changelogPath, 'utf8')

      await writeFile(changelogPath, `${newLog}\n${changelogData}`, 'utf8')
    } catch (e) {
      await writeFile(changelogPath, newLog, 'utf8')
    }
  }
}
