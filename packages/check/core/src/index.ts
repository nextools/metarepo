import util from 'util'
import assert from 'assert'

const inspect = (arg: any): string => util.inspect(arg, false, null, true)

const equal = (a: any, b: any) => {
  try {
    assert.deepEqual(a, b)
  } catch {
    throw `${inspect(a)} is not equal to ${inspect(b)}`
  }
}

export type TTestFn = (equal: (a: any, b: any) => void) => Promise<void>
export type TTest = (name: string, testFn: TTestFn) => void

export const suite = (name: string, test: (test: TTest) => void) => async () => {
  const testFns = [] as [string, TTestFn][]

  test((name, body) => {
    testFns.push([name, body])
  })

  // await Promise.all(
  //   testFns.map(async ([testName, testFn]) => {
  for (const [testName, testFn] of testFns) {
    try {
      await testFn(equal)
      console.log(`✔︎ ${name}: ${testName}`)
    } catch (e) {
      console.error(`✘ ${name}: ${testName}`)

      if (e instanceof Error) {
        console.error(`  ${e.message}`)

        if (typeof e.stack === 'string') {
          console.error(e.stack.slice(e.stack.indexOf('\n')))
        }
      } else {
        console.error(`  ${e}`)
      }
    }
  }
  //   })
  // )
}

export const main = suite('foo', (test) => {
  test('test 1', async (equal) => {
    await Promise.resolve()

    equal(
      { a: 1 },
      { a: 2 }
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
