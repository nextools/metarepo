import path from 'path'
import execa from 'execa'
import { readFile, writeFile } from 'pifs'

export const writeChangelog = async (log: string, dir: string) => {
  const logPath = path.join(dir, 'changelog.md')

  try {
    const changelogData = await readFile(logPath, 'utf8')

    await writeFile(logPath, `${log}\n${changelogData}`, 'utf8')
  } catch {
    await writeFile(logPath, log, 'utf8')
  } finally {
    await execa('git', ['add', logPath])
  }
}
