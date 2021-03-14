import { readFile } from 'fs/promises'
import { join as pathJoin, resolve as pathResolve } from 'path'
import readline from 'readline'
import { map } from 'iterama'
import { piAllAsync } from 'piall'
import type { TPackageJson } from 'pkgu'
import { startTimeMs } from 'takes'
import { once } from 'wans'
import { getWorkers, workerify } from './workers'

type TStartOptions = {
  tasks: string,
  reporter?: string,
  require?: (string | [string, { [k: string]: any }])[],
}

const endTimeMs = startTimeMs()

const packageJsonPath = pathJoin(process.cwd(), 'package.json')
const packageJsonData = await readFile(packageJsonPath, 'utf8')
const packageJson = JSON.parse(packageJsonData) as TPackageJson & { start: TStartOptions }
const tasksFilePath = pathResolve(packageJson.start.tasks)
const tasksExported = await import(tasksFilePath)
const taskNames = Object.keys(tasksExported)

const workers = await getWorkers(tasksFilePath)

console.log('workers: ', workers.length)

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

const workerized = workerify(workers)

while (true) {
  rl.prompt()

  const input = await once<string>(rl, 'line')

  if (input === '/tasks') {
    console.log('tasks:', taskNames)

    continue
  }

  if (input === '/quit') {
    rl.close()

    await Promise.all(
      workers.map((worker) => worker.terminate())
    )

    console.log('bye')

    break
  }

  if (!autocomplete.includes(input)) {
    console.error(`unknown: ${input}`)

    continue
  }

  const it = await tasksExported[input]()
  // const pit = piAllAsync(it, 2)

  for await (const i of it) {
    console.log(i)
  }
}

