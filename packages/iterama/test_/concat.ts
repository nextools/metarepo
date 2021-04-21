import { deepStrictEqual } from 'assert'
import { concat } from '../src/concat'
import { range } from '../src/range'
import { slice } from '../src/slice'
import { toArray } from '../src/to-array'

export const tests = [
  () => {
    const iterable1 = range(5)
    const iterable2 = slice(5)(range(10))
    const result = toArray(concat(iterable1, iterable2))

    deepStrictEqual(
      result,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      'concact: should work'
    )
  },
]

export const target = '../src/concat.ts'
