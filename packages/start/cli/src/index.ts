#!/bin/sh
//bin/sh -c :; exec /usr/bin/env node --inspect-publish-uid=http --enable-source-maps --require @nextools/suppress-experimental-warnings --experimental-import-meta-resolve --experimental-loader @start/ts-esm-loader "$0" "$@"
// https://unix.stackexchange.com/questions/65235/universal-node-js-shebang#comment755057_65295

import { readFile } from 'fs/promises'
import inspector from 'inspector'
import { cpus } from 'os'
import path from 'path'
import readline from 'readline'
import { startThreadPool } from '@start/thread-pool'
// import dotenv from 'dotenv'
import { iterateObjectEntries } from 'itobj'
import { jsonParse } from 'typeon'
import { once } from 'wans'
import type { TTask } from '../../../../tasks/types'
import { roundBytes } from './round-bytes'
import { runTask } from './run-task'

type TTasks = {
  [key: string]: TTask<any, any>,
}

type TStartPackageJson = {
  start: {
    tasks: string,
    require?: (string | [string, { [k: string]: any }])[],
  },
}

try {
  // dotenv.config()

  const packageJsonPath = path.resolve('package.json')
  const packageJsonData = await readFile(packageJsonPath, 'utf8')
  const packageJson = jsonParse<TStartPackageJson>(packageJsonData)
  // @ts-ignore
  const tasksFilePath = await import.meta.resolve(packageJson.start.tasks, `file://${process.cwd()}/`)
  const tasksExported = await import(tasksFilePath) as TTasks
  const taskNames = Object.keys(tasksExported)
  const threadCount = cpus().length
  const stopThreadPool = await startThreadPool({ threadCount })

  console.log(`🧵 treads: ${threadCount}`)

  // CLI
  if (process.argv.length > 2) {
    const [taskName, ...args] = process.argv.slice(2)
    const task = tasksExported[taskName]

    console.log(`👉 ${taskName} ${args.join(' ')}`)

    await runTask(task, args)
    await stopThreadPool()
  // REPL
  } else {
    const commands = ['/memory', '/debug', '/quit']
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
    let isInDebugMode = false

    rl.once('SIGINT', async () => {
      console.log('/quit')
      await stopThreadPool()
      console.log('👋 bye')
      process.exit()
    })

    console.log(`📋 tasks: ${taskNames.join(', ')}`)
    console.log(`🤖 commands: ${commands.join(', ')}`)

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

      if (input === '/debug') {
        if (!isInDebugMode) {
        // https://github.com/nodejs/node/issues/34799
          inspector.open()
          console.log('🕵️  attach to the debugger via VSCode or chrome://inspect/')
          inspector.waitForDebugger()
          console.log('ℹ️  run /debug again to exit')

          isInDebugMode = true
        } else {
          inspector.close()

          isInDebugMode = false
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

      await runTask(task, args)
    }
  }
} catch (err) {
  console.error(err)
  process.exit(1)
}
