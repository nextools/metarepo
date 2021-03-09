import { readFile } from 'fs/promises'
import { cpus } from 'os'
import { join as pathJoin, resolve as pathResolve } from 'path'
import readline from 'readline'
import { Worker } from 'worker_threads'
import type { TPackageJson } from 'pkgu'
import { once } from 'wans'
import { resolve } from './resolve'

type TStartOptions = {
  tasks: string,
  reporter?: string,
  require?: (string | [string, { [k: string]: any }])[],
}

const start = process.hrtime.bigint()

const packageJsonPath = pathJoin(process.cwd(), 'package.json')
const packageJsonData = await readFile(packageJsonPath, 'utf8')
const packageJson = JSON.parse(packageJsonData) as TPackageJson & { start: TStartOptions }
const tasksFilePath = pathResolve(packageJson.start.tasks)
const tasksExported = await import(tasksFilePath)
const taskNames = Object.keys(tasksExported)

const workerPath = await resolve('./worker.mjs')
const workerCount = cpus().length

const workers = await Promise.all(
  Array.from({ length: workerCount }, async () => {
    const worker = new Worker(workerPath, {
      workerData: {
        tasksFilePath,
      },
    })

    await once(worker, 'online')

    return worker
  })
)

console.log('workers: ', workers.length)

const end = process.hrtime.bigint()
const diff = (end - start) / BigInt(1e6)

console.log('tasks:', taskNames)
console.log('time:', String(diff))

// await tasksExported.build()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  tabSize: 4,
  prompt: '> ',
  completer: (input: string) => [
    taskNames.filter((taskName) => taskName.startsWith(input)),
    input,
  ],
})

while (true) {
  rl.prompt()

  const input = await once<string>(rl, 'line')

  if (input === 'q') {
    rl.close()

    await Promise.all(
      workers.map((worker) => worker.terminate())
    )

    console.log('bye')

    break
  }

  if (!taskNames.includes(input)) {
    console.error(`unknown: ${input}`)

    continue
  }

  await tasksExported[input](workers)
}

