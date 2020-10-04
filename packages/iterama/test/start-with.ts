import { pipe } from 'funcom'
import test from 'tape'
import { range } from '../src/range'
import { startWith } from '../src/start-with'
import { toArray } from '../src/to-array'

test('iterama: startWith', (t) => {
  const iterable = range(3)
  const result = pipe(
    startWith(-1),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [-1, 0, 1, 2],
    'should start with value'
  )

  t.end()
})
