#!/bin/sh
//bin/sh -c :; exec /usr/bin/env node --require @start/cli/get-startup-time --require @nextools/suppress-experimental-warnings --experimental-import-meta-resolve --experimental-loader @start/ts-esm-loader "$0" "$@"
// https://unix.stackexchange.com/questions/65235/universal-node-js-shebang#comment755057_65295

import { readFile } from 'fs/promises'
import { cpus } from 'os'
import path from 'path'
import readline from 'readline'
import { startThreadPool } from '@start/thread-pool'
// import dotenv from 'dotenv'
// import { pipeAsync } from 'funcom'
import { drainAsync } from 'iterama'
import { iterateObjectEntries } from 'itobj'
import { red } from 'kolorist'
import type { TPackageJson } from 'pkgu'
import StackUtils from 'stack-utils'
import { startTimeMs } from 'takes'
import { isString } from 'tsfn'
import { once } from 'wans'
// @ts-ignore
import { getStartupTime } from './get-startup-time.cjs'
import { roundBytes } from './round-bytes'

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

  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJsonData = await readFile(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonData) as TPackageJson & { start: TStartOptions }
  const tasksFilePath = path.resolve(packageJson.start.tasks)
  const tasksExported = await import(tasksFilePath) as TTasks
  const taskNames = Object.keys(tasksExported)
  const threadCount = cpus().length
  const commands = ['/memory', '/quit']

  console.log(`📋 tasks: ${taskNames.join(', ')}`)
  console.log(`🤖 commands: ${commands.join(', ')}`)

  const stopThreadPool = await startThreadPool({ threadCount })

  console.log(`🧵 treads: ${threadCount}`)
  console.log(`⏱  startup: ${getStartupTime()}ms`)

  const autocomplete = taskNames.concat(commands)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\n👉 ',
    completer: (input: string) => [
      autocomplete.reduce((result, item) => {
        if (item.startsWith(input)) {
          if (commands.includes(item)) {
            result.push(item)
          } else {
            result.push(`${item} `)
          }
        }

        return result
      }, [] as string[]),
      input,
    ],
  })

  rl.once('SIGINT', async () => {
    console.log('/quit')
    await stopThreadPool()
    console.log('👋 bye')
    process.exit()
  })

  while (true) {
    rl.prompt()

    let input = await once<string>(rl, 'line')

    input = input.trim()

    if (input.length === 0) {
      continue
    }

    if (input === '/memory') {
      for (const [key, value] of iterateObjectEntries(process.memoryUsage())) {
        console.log(`🔘 ${key}: ${roundBytes(value)}MB`)
      }

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
      console.error(`❓ unknown: ${taskName}`)

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

      console.log(`⏱  time: ${tookMs}ms`)
    }
  }
} catch (err) {
  console.error(err)
  process.exit(1)
}
