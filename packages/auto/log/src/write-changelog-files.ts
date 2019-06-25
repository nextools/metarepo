import path from 'path'
import { promisify } from 'util'
import { readFile, writeFile } from 'graceful-fs'
import { TPrefixes } from '@auto/utils'
import { TLog } from './types'

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

export const writeChangelogFiles = async (logs: TLog[], prefixes: TPrefixes) => {
  for (const log of logs) {
    const changelogPath = path.join(log.dir, 'changelog.md')
    let newLog = `## v${log.version}\n\n`

    log.messages.forEach((message) => {
      newLog += `* ${prefixes.required[message.type].value} ${message.value}\n`
    })

    try {
      const changelogData = await pReadFile(changelogPath, 'utf8')

      await pWriteFile(changelogPath, `${newLog}\n${changelogData}`, 'utf8')
    } catch (e) {
      await pWriteFile(changelogPath, newLog, 'utf8')
    }
  }
}
