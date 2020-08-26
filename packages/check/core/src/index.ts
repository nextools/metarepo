/* eslint-disable no-loop-func */
import assert from 'assert'
import type { EventEmitter } from 'events'
import util from 'util'
import { types as t } from '@babel/core'
import generate from '@babel/generator'
import traverse from '@babel/traverse'
import { ESLint } from 'eslint'
import getCallerFile from 'get-caller-file'
import { readFile, writeFile } from 'pifs'
import { parse } from './parse'

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

type TCheck = {
  (actual: any, expected: any, message: string): void,
  (actual: any, message: string): void,
}
type TTestFn = (check: TCheck) => Promise<void>
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
  const actuals: string[] = []

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
      await testFn((...args: unknown[]) => {
        if (args.length === 2) {
          actuals.push(JSON.stringify(args[0]))
          okCount++
          reporter.emit('checkOk', args[1])
        } else if (args.length === 3) {
          try {
            compare(args[0], args[1])
            reporter.emit('checkOk', args[2])
          } catch (error) {
            errorCount++
            reporter.emit('checkError', error)
          }
        }
      })
    } catch (error) {
      reporter.emit('testError', error)
    } finally {
      await afterTest?.()
    }
  }

  await afterSuite?.()

  // modify file
  const filePath = getCallerFile(3)
  const fileContent = await readFile(filePath, 'utf8')
  const ast = parse(fileContent)

  traverse(ast, {
    CallExpression(path) {
      if (
        path.node.callee.type === 'Identifier' &&
        path.node.callee.name === 'check' &&
        path.node.arguments.length === 2
      ) {
        path.node.arguments[2] = path.node.arguments[1]

        const obj = parse(`(${actuals.shift()!})`).program.body[0].expression

        path.node.arguments[1] = obj
        // path.node.arguments[1] = t.objectExpression([
        //   t.objectProperty(t.identifier('foo'), t.booleanLiteral(true)),
        //   t.objectProperty(t.identifier('bar'), t.numericLiteral(123)),
        // ])
      }
    },
  })

  const output = generate(ast, {
    retainLines: true,
    retainFunctionParens: true,
  })

  // console.log(output.code)

  const eslint = new ESLint({ fix: true })
  const results = await eslint.lintText(output.code, { filePath })

  console.log(results[0].output!)
  // await writeFile(filePath, results[0].output!)

  return {
    totalCount: okCount + errorCount,
    okCount,
    errorCount,
  }
}
