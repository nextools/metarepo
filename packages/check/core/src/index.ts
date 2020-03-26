import util from 'util'
import assert from 'assert'
import { EventEmitter } from 'events'
import path from 'path'
import { readFile, writeFile, mkdir } from 'pifs'
import StackUtils from 'stack-utils'
import chalk from 'chalk'
import getCallerFile from 'get-caller-file'

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

const compare = (a: any, b: any) => {
  try {
    assert.deepEqual(a, b)
  } catch {
    throw `${inspect(a)} is not equal to ${inspect(b)}`
  }
}

type TVoidCallback = () => void | Promise<void>
type TOnCallback = (() => TVoidCallback | Promise<TVoidCallback>)

type TTestFn = (check: (value: any, message: string) => void) => Promise<void>
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
  const checkDir = path.dirname(getCallerFile())
  const snapshotDir = path.resolve(checkDir, '__check__')
  const snapshotPath = path.resolve(snapshotDir, `${suiteName}.json`)
  const tests = [] as [string, TTestFn][]
  let onSuite = null as null | TOnCallback
  let onTest = null as null | TOnCallback
  let okCount = 0
  let errorCount = 0
  let snapshot = {} as { [key: string]: any }

  try {
    const data = await readFile(snapshotPath, 'utf8')

    snapshot = JSON.parse(data)
  } catch {
    await mkdir(snapshotDir)
  }

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
      await testFn((value: any, message: string) => {
        try {
          if (Reflect.has(snapshot, testName)) {
            compare(snapshot[testName].value, value)
          }
        } finally {
          snapshot[testName] = { message, value }
        }
      })

      okCount++

      reporter.emit('ok', suiteName, testName)
    } catch (error) {
      errorCount++

      reporter.emit('error', suiteName, testName, error)
    } finally {
      await afterTest?.()
    }
  }

  await writeFile(snapshotPath, JSON.stringify(snapshot, null, 2))
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

      //
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

    test('test 1', async (check) => {
      await Promise.resolve()

      check(
        { a: 2 },
        'should be fine'
      )
    })

    test('test 2', async (check) => {
      await Promise.resolve()

      check(
        { a: 1 },
        'should be fine'
      )
    })
  })

  const result = await runSuite(reporter)

  console.log('-----------------------------------------------------')
  console.log(result)
}
