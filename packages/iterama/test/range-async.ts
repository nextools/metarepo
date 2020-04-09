import test from 'tape'
import { rangeAsync } from '../src/range-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: rangeAsync', async (t) => {
  const result = await toArrayAsync(rangeAsync(5))

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should return async iterable filled with numbers'
  )

  t.end()
})
