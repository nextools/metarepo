/* eslint-disable no-loop-func */
import assert from 'assert'
import type { EventEmitter } from 'events'
import util from 'util'

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

type TCheck = (a: any, b: any, message: string) => void
type TTestFn = (check: TCheck) => Promise<void> | void
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

    reporter.emit('testStart', suiteName, testName)

    try {
      await testFn((a, b, message) => {
        try {
          compare(a, b)

          okCount++

          reporter.emit('checkOk', message)
        } catch (error) {
          errorCount++

          reporter.emit('checkError', error)
        }
      })
    } catch (error) {
      reporter.emit('testError', error)
    } finally {
      await afterTest?.()
    }
  }

  await afterSuite?.()

  return {
    totalCount: okCount + errorCount,
    okCount,
    errorCount,
  }
}
