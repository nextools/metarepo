import test from 'tape'
import { rangeAsync } from '../src/range-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: toArrayAsync', async (t) => {
  const iterable = rangeAsync(5)
  const result = await toArrayAsync(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should convert async iterable into array'
  )

  t.end()
})
