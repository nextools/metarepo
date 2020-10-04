import { pipe } from 'funcom'
import test from 'tape'
import { rangeAsync } from '../src/range-async'
import { startWithAsync } from '../src/start-with-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: startWithAsync', async (t) => {
  const iterable = rangeAsync(3)
  const result = await pipe(
    startWithAsync(-1),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [-1, 0, 1, 2],
    'should start with value'
  )

  t.end()
})
