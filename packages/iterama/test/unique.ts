import { pipe } from 'funcom'
import test from 'tape'
import { toArray } from '../src/to-array'
import { unique } from '../src/unique'

test('iterama: unique', (t) => {
  const iterable = {
    *[Symbol.iterator]() {
      yield 1
      yield 1
      yield 3
      yield 4
      yield 3
    },
  }
  const result = pipe(
    unique,
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [1, 3, 4],
    'should keep only unique elements'
  )

  t.end()
})
