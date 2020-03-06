import util from 'util'
import assert from 'assert'
import { EventEmitter } from 'events'
import StackUtils from 'stack-utils'
import chalk from 'chalk'

const stackUtils = new StackUtils({
  cwd: process.cwd(),
  internals: StackUtils.nodeInternals(),
})

const reporter = new EventEmitter()

reporter.on('ok', (suiteName: string, testName: string) => {
  console.log(`${chalk.green('✔')}︎ ${suiteName}: ${testName}`)
})

reporter.on('error', (suiteName: string, testName: string, error: Error | string) => {
  console.error(`${chalk.red('✘')} ${suiteName}: ${testName}`)

  if (error instanceof Error) {
    console.error(`  ${chalk.red(`error: ${error.message}`)}`)

    if (typeof error.stack === 'string') {
      const stackTrace = stackUtils.clean(error.stack).trim()

      console.error(`  ${chalk.red('stack trace:')}`)
      stackTrace.split('\n').forEach((line) => {
        console.error(`  - ${chalk.red(line)}`)
      })
    }
  } else {
    console.error(`  ${chalk.red(`error: ${error}`)}`)
  }
})

const inspect = (arg: any): string => util.inspect(arg, false, null, true)

const equal = (a: any, b: any) => {
  try {
    assert.deepEqual(a, b)
  } catch {
    throw `${inspect(a)} is not equal to ${inspect(b)}`
  }
}

type TVoidCallback = () => void | Promise<void>
type TOnCallback = (() => TVoidCallback | Promise<TVoidCallback>)

type TTestFn = (equal: (a: any, b: any) => void) => Promise<void>
type TTest = {
  test: (name: string, testFn: TTestFn) => void,
  onSuite: (callback: TOnCallback) => void,
  onTest: (callback: TOnCallback) => void,
}
type TSuiteResult = Promise<{
  totalCount: number,
  okCount: number,
  errorCount: number,
}>

export const suite = (suiteName: string, test: (test: TTest) => void) => async (reporter: EventEmitter): TSuiteResult => {
  const tests = [] as [string, TTestFn][]
  let onSuite = null as null | TOnCallback
  let onTest = null as null | TOnCallback
  let okCount = 0
  let errorCount = 0

  test({
    test: (name, body) => {
      tests.push([name, body])
    },
    onSuite: (callback) => {
      onSuite = callback
    },
    onTest: (callback) => {
      onTest = callback
    },
  })

  const afterSuite = await onSuite?.()

  for (const [testName, testFn] of tests) {
    const afterTest = await onTest?.()

    try {
      await testFn(equal)

      okCount++

      reporter.emit('ok', suiteName, testName)
    } catch (error) {
      errorCount++

      reporter.emit('error', suiteName, testName, error)
    } finally {
      await afterTest?.()
    }
  }

  await afterSuite?.()

  return {
    totalCount: tests.length,
    okCount,
    errorCount,
  }
}

export const main = async () => {
  const runSuite = suite('foo', ({ test, onSuite, onTest }) => {
    onSuite(async () => {
      await Promise.resolve()
      // console.log('before suite')

      return async () => {
        await Promise.resolve()
      // console.log('after suite')
      }
    })

    onTest(async () => {
      await Promise.resolve()
      // console.log('before test')

      return async () => {
        await Promise.resolve()
      // console.log('after test')
      }
    })

    test('test 1', async (equal) => {
      await Promise.resolve()

      equal(
        { a: 2 },
        { a: 1 }
      )
    })

    test('test 2', async (equal) => {
      await Promise.resolve()

      equal(
        { a: 1 },
        { a: 1 }
      )
    })
  })

  const result = await runSuite(reporter)

  console.log('-----------------------------------------------------')
  console.log(result)
}
