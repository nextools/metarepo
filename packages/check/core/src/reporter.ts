import { EventEmitter } from 'events'
import chalk from 'chalk'
import StackUtils from 'stack-utils'

const stackUtils = new StackUtils({
  cwd: process.cwd(),
  internals: StackUtils.nodeInternals(),
})

export const reporter = new EventEmitter()

reporter.on('testStart', (suiteName: string, testName: string) => {
  console.log(`${suiteName}: ${testName}`)
})

reporter.on('testError', (error: Error | string) => {
  if (error instanceof Error) {
    console.error(`error: ${chalk.red(error.message)}`)

    if (typeof error.stack === 'string') {
      const stackTrace = stackUtils.clean(error.stack).trim()

      stackTrace.split('\n').forEach((line) => {
        console.error(`  ${chalk.red(line)}`)
      })
    }
  } else {
    console.error(`  error: ${chalk.red(error)}`)
  }
})

reporter.on('checkOk', (message: string) => {
  console.log(`  ${chalk.green('✔')}︎ ${message}`)
})

reporter.on('checkError', (error: Error | string) => {
  if (error instanceof Error) {
    console.error(`  ${chalk.red('✘')} ${error.message}`)

    if (typeof error.stack === 'string') {
      const stackTrace = stackUtils.clean(error.stack).trim()

      stackTrace.split('\n').forEach((line) => {
        console.error(`  ${chalk.red(line)}`)
      })
    }
  } else {
    console.error(`  ${chalk.red('✘')} ${error}`)
  }
})
