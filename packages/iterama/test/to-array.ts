import test from 'tape'
import { toArray } from '../src/to-array'
import { range } from '../src/range'

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
