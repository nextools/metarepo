import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from 'funcom'
import { filterAsync } from '../src/filter-async'
import { toArrayAsync } from '../src/to-array-async'
import { rangeAsync } from '../src/range-async'

test('iterama: filterAsync', async (t) => {
  const iterable = rangeAsync(5)
  const isEven = (x: number) => Promise.resolve(x % 2 === 0)
  const spyFilter: typeof isEven = createSpy(({ args }) => isEven(args[0]))
  const result = await pipe(
    filterAsync(spyFilter),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyFilter),
    [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ],
    'should pass value and counter to filter function'
  )

  t.deepEquals(
    result,
    [0, 2, 4],
    'should iterate and filter over async iterable'
  )
})
