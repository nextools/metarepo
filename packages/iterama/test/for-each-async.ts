import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from 'funcom'
import { forEachAsync } from '../src/for-each-async'
import { toArrayAsync } from '../src/to-array-async'
import { rangeAsync } from '../src/range-async'

test('iterama: forEachAsync', async (t) => {
  const iterable = rangeAsync(5)
  const spyForEach = createSpy(() => {})
  const result = await pipe(
    forEachAsync(spyForEach),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyForEach),
    [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ],
    'should pass value and counter to forEach function'
  )

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should pass async iterable through'
  )
})
