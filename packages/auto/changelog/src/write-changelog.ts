import path from 'path'
import { readFile, writeFile } from 'pifs'
import { spawnChildProcess } from 'spown'

export const writeChangelog = async (log: string, dir: string) => {
  const logPath = path.join(dir, 'changelog.md')

  try {
    const changelogData = await readFile(logPath, 'utf8')

    await writeFile(logPath, `${log}\n${changelogData}`, 'utf8')
  } catch {
    await writeFile(logPath, log, 'utf8')
  } finally {
    await spawnChildProcess(`git add ${logPath}`, {
      stdout: null,
      stderr: process.stderr,
    })
  }
}
