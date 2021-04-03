#!/bin/sh
//bin/sh -c :; exec /usr/bin/env node --require @start/cli/get-startup-time --require @nextools/suppress-experimental-warnings --experimental-import-meta-resolve --experimental-loader @start/ts-esm-loader "$0" "$@"
// https://unix.stackexchange.com/questions/65235/universal-node-js-shebang#comment755057_65295

import { readFile } from 'fs/promises'
import { cpus } from 'os'
import { join as pathJoin, resolve as pathResolve } from 'path'
import readline from 'readline'
import { startThreadPool } from '@start/thread-pool'
// import dotenv from 'dotenv'
// import { pipeAsync } from 'funcom'
import { drainAsync } from 'iterama'
import { red } from 'kolorist'
import type { TPackageJson } from 'pkgu'
import StackUtils from 'stack-utils'
import { startTimeMs } from 'takes'
import { isString } from 'tsfn'
import { once } from 'wans'
// @ts-ignore
import { getStartupTime } from './get-startup-time.cjs'

type TTasks = {
  [key: string]: (...args: string[]) => AsyncIterableIterator<any>,
}

type TStartOptions = {
  tasks: string,
  reporter?: string,
  require?: (string | [string, { [k: string]: any }])[],
}

try {
  // dotenv.config()

  const packageJsonPath = pathJoin(process.cwd(), 'package.json')
  const packageJsonData = await readFile(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonData) as TPackageJson & { start: TStartOptions }
  const tasksFilePath = pathResolve(packageJson.start.tasks)
  const tasksExported = await import(tasksFilePath) as TTasks
  const taskNames = Object.keys(tasksExported)
  const threadCount = cpus().length

  console.log(`📋 ${taskNames.join(', ')}`)

  const stopThreadPool = await startThreadPool({ threadCount })

  console.log(`🧵 ${threadCount} threads`)
  console.log(`⏱  ${getStartupTime()}ms`)

  const autocomplete = taskNames.concat('/tasks', '/quit')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    tabSize: 4,
    prompt: '\n👉 ',
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
      console.log(`📋 ${taskNames.join(', ')}`)

      continue
    }

    if (input === '/quit') {
      rl.close()

      await stopThreadPool()

      console.log('👋 bye')

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
      await drainAsync(it)

      // let i = 0

      // await pipeAsync(
      //   forEachAsync(() => {
      //     process.stdout.clearLine(0)
      //     process.stdout.cursorTo(0)
      //     process.stdout.write(`items: ${++i}`)
      //   }),
      //   drainAsync
      // )(it)

      // process.stdout.write('\n')
    } catch (err) {
      if (err instanceof Error) {
        console.error(red(`\nerror: ${err.message}`))

        if (isString(err.stack)) {
          const stackUtils = new StackUtils({
            cwd: process.cwd(),
            internals: StackUtils.nodeInternals(),
          })
          const stack = stackUtils.clean(err.stack)

          console.error(red(`\n${stack.trim()}\n`))
        }
        // array of "soft" errors
      } else if (isString(err)) {
        console.error(red(`\n${err}\n`))
      }
    } finally {
      const tookMs = endTimeMs()

      console.log(`⏱  ${tookMs}ms`)
    }
  }
} catch (err) {
  console.error(err)
  process.exit(1)
}
