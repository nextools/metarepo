import test from 'tape'
import { range } from '../src/range'
import { toArray } from '../src/to-array'

test('iterama: range', (t) => {
  const result = toArray(range(5))

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should return iterable filled with numbers'
  )

  t.end()
})
