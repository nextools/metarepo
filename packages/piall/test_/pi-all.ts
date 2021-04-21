import { deepStrictEqual } from 'assert'
import { createSpy, getSpyCalls } from 'spyfn'
import { piAll } from '../src/pi-all'

const waitFor = async (ticks: number[], index: number): Promise<void> => {
  for (let i = 0; i < ticks[index]; i++) {
    await Promise.resolve()
  }
}

export const tests = [
  async () => {
    const resultSpy = createSpy(() => {})
    const promiseSpy = createSpy(async ({ args, index }) => {
      await waitFor([3, 1, 2], index)

      return Promise.resolve(args[0])
    })
    const asyncIterable = piAll(1)([
      () => promiseSpy(1),
      () => promiseSpy(2),
      () => promiseSpy(3),
    ])

    for await (const result of asyncIterable) {
      resultSpy(result)
    }

    deepStrictEqual(
      getSpyCalls(resultSpy),
      [[1], [2], [3]],
      '3 with concurrency 1'
    )
  },
]

export const target = '../src/pi-all.ts'
