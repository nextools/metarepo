import test from 'tape'
import { concat } from '../src/concat'
import { range } from '../src/range'
import { slice } from '../src/slice'
import { toArray } from '../src/to-array'

test('iterama: concat', (t) => {
  const iterable1 = range(5)
  const iterable2 = slice(5)(range(10))
  const result = toArray(concat(iterable1, iterable2))

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    'should concat 2 iterables'
  )

  t.end()
})
