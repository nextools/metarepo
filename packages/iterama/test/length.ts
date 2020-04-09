import test from 'tape'
import { length } from '../src/length'
import { range } from '../src/range'

test('iterama: length', (t) => {
  const iterable = range(5)
  const result = length(iterable)

  t.equals(
    result,
    5,
    'should return length of iterable'
  )

  t.end()
})
