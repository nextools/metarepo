import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from 'funcom'
import { mapAsync } from '../src/map-async'
import { toArrayAsync } from '../src/to-array-async'
import { rangeAsync } from '../src/range-async'

test('iterama: mapAsync', async (t) => {
  const iterable = rangeAsync(5)
  const spyMapper = createSpy(({ args }) => Promise.resolve(args[0] * 2))
  const result = await pipe(
    mapAsync(spyMapper),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyMapper),
    [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ],
    'should pass value and counter to mapper function'
  )

  t.deepEquals(
    result,
    [0, 2, 4, 6, 8],
    'should iterate and map over async iterable'
  )
})
