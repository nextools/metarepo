import test from 'tape'
import { lengthAsync } from '../src/length-async'
import { rangeAsync } from '../src/range-async'

test('iterama: lengthAsync', async (t) => {
  const iterable = rangeAsync(5)
  const result = await lengthAsync(iterable)

  t.equals(
    result,
    5,
    'should return length of iterable'
  )

  t.end()
})
