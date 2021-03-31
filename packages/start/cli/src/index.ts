#!/bin/sh
//bin/sh -c :; exec /usr/bin/env node --require @nextools/suppress-experimental-warnings --experimental-import-meta-resolve --experimental-loader @start/ts-esm-loader "$0" "$@"
// https://unix.stackexchange.com/questions/65235/universal-node-js-shebang#comment755057_65295

import { readFile } from 'fs/promises'
import { join as pathJoin, resolve as pathResolve } from 'path'
import readline from 'readline'
import { startThreadPool } from '@start/thread-pool'
// import dotenv from 'dotenv'
import { pipeAsync } from 'funcom'
import { drainAsync, forEachAsync } from 'iterama'
import type { TPackageJson } from 'pkgu'
import { startTimeMs } from 'takes'
import { once } from 'wans'

type TTasks = {
  [key: string]: (...args: string[]) => AsyncIterableIterator<any>,
}

type TStartOptions = {
  tasks: string,
  reporter?: string,
  require?: (string | [string, { [k: string]: any }])[],
}

try {
  const endTimeMs = startTimeMs()

  // dotenv.config()

  const packageJsonPath = pathJoin(process.cwd(), 'package.json')
  const packageJsonData = await readFile(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonData) as TPackageJson & { start: TStartOptions }
  const tasksFilePath = pathResolve(packageJson.start.tasks)
  const tasksExported = await import(tasksFilePath) as TTasks
  const taskNames = Object.keys(tasksExported)

  console.log('tasks:', taskNames)

  const stopThreadPool = await startThreadPool({
    threadCount: 8,
  })

  const tookMs = endTimeMs()

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

  rl.once('SIGINT', () => {
    process.exit()
  })

  while (true) {
    rl.prompt()

    const input = await once<string>(rl, 'line')

    if (input.length === 0) {
      continue
    }

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

    const [taskName, ...args] = input.split(' ')

    if (!autocomplete.includes(taskName)) {
      console.error(`unknown: ${taskName}`)

      continue
    }

    const task = tasksExported[taskName]
    const it = task(...args)

    const endTimeMs = startTimeMs()

    try {
      let i = 0

      await pipeAsync(
        forEachAsync(() => {
          process.stdout.clearLine(0)
          process.stdout.cursorTo(0)
          process.stdout.write(`items: ${++i}`)
        }),
        drainAsync
      )(it)

      process.stdout.write('\n')
    } catch (err) {
      console.error(err)
    } finally {
      const tookMs = endTimeMs()

      console.log(`time: ${tookMs}ms`)
    }
  }
} catch (err) {
  console.error(err)
  process.exit(1)
}
