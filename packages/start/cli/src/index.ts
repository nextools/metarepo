import { readFile } from 'fs/promises'
import { cpus } from 'os'
import { join as pathJoin, resolve as pathResolve } from 'path'
import readline from 'readline'
import { startThreadPool } from '@tpool/server'
import type { TPackageJson } from 'pkgu'
import { startTimeMs } from 'takes'
import { once } from 'wans'

type TStartOptions = {
  tasks: string,
  reporter?: string,
  require?: (string | [string, { [k: string]: any }])[],
}

const SOCKET_PATH = '/tmp/start.sock'

const endTimeMs = startTimeMs()

const packageJsonPath = pathJoin(process.cwd(), 'package.json')
const packageJsonData = await readFile(packageJsonPath, 'utf8')
const packageJson = JSON.parse(packageJsonData) as TPackageJson & { start: TStartOptions }
const tasksFilePath = pathResolve(packageJson.start.tasks)
const tasksExported = await import(tasksFilePath)
const taskNames = Object.keys(tasksExported)

const stopThreadPool = await startThreadPool({
  threadCount: cpus().length,
  socketPath: SOCKET_PATH,
})

const tookMs = endTimeMs()

console.log('tasks:', taskNames)
console.log('time:', `${tookMs}ms`)

const autocomplete = taskNames.concat('/tasks', '/quit')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  tabSize: 4,
  prompt: '> ',
  completer: (input: string) => [
    autocomplete.filter((item) => item.startsWith(input)),
    input,
  ],
})

while (true) {
  rl.prompt()

  const input = await once<string>(rl, 'line')

  if (input === '/tasks') {
    console.log('tasks:', taskNames)

    continue
  }

  if (input === '/quit') {
    rl.close()

    await stopThreadPool()

    console.log('bye')

    break
  }

  if (!autocomplete.includes(input)) {
    console.error(`unknown: ${input}`)

    continue
  }

  const it = await tasksExported[input]()

  for await (const i of it) {
    console.log(i)
  }
}
