import { deepStrictEqual } from 'assert'
import { concatAsync } from '../src/concat-async'
import { toArrayAsync } from '../src/to-array-async'

export const tests = [
  async () => {
    const iterable1 = {
      async *[Symbol.asyncIterator]() {
        for (let i = 1; i <= 5; i++) {
          yield await Promise.resolve(i)
        }
      },
    }
    const iterable2 = {
      async *[Symbol.asyncIterator]() {
        for (let i = 6; i <= 9; i++) {
          yield await Promise.resolve(i)
        }
      },
    }
    const result = await toArrayAsync(concatAsync(iterable1, iterable2))

    deepStrictEqual(
      result,
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      'concatAsync: should work'
    )
  },
]

export const target = '../src/concat-async.ts'
