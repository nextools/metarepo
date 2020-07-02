import { pipe } from 'funcom'
import test from 'tape'
import { distinct } from '../src/distinct'
import { toArray } from '../src/to-array'

test('iterama: distinct', (t) => {
  const iterable = {
    *[Symbol.iterator]() {
      yield
      yield 1
      yield 1
      yield 3
      yield 3
      yield 4
      yield
      yield
      yield 3
    },
  }
  const result = pipe(
    distinct,
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [undefined, 1, 3, 4, undefined, 3],
    'should iterate and distinct over iterable'
  )

  t.end()
})

