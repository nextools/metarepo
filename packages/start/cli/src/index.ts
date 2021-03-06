import { readFile } from 'fs/promises'
import { join as pathJoin, resolve as pathResolve } from 'path'
import type { TPackageJson } from 'pkgu'

type TStartOptions = {
  tasks: string,
  reporter?: string,
  require?: (string | [string, { [k: string]: any }])[],
}

void (async () => {
  const packageJsonPath = pathJoin(process.cwd(), 'package.json')
  const packageJsonData = await readFile(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonData) as TPackageJson & { start: TStartOptions }
  const tasksFilePath = pathResolve(packageJson.start.tasks)
  const tasksExported = await import(tasksFilePath)
  const tasks = Object.keys(tasksExported)

  console.log('tasks:', tasks)

  await tasksExported.build()

  console.log('done')
})().catch(console.error)
