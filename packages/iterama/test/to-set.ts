import test from 'tape'
import { range } from '../src/range'
import { toSet } from '../src/to-set'

test('iterama: toSet', (t) => {
  const iterable = range(5)
  const result = toSet(iterable)

  t.deepEquals(
    result,
    new Set([0, 1, 2, 3, 4]),
    'should convert iterable into set'
  )

  t.end()
})
