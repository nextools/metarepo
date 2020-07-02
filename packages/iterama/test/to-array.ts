import test from 'tape'
import { range } from '../src/range'
import { toArray } from '../src/to-array'

test('iterama: toArray', (t) => {
  const iterable = range(5)
  const result = toArray(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should convert iterable into array'
  )

  t.end()
})
