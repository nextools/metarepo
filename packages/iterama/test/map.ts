import { pipe } from 'funcom'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { map } from '../src/map'
import { range } from '../src/range'
import { toArray } from '../src/to-array'

test('iterama: map', (t) => {
  const iterable = range(5)
  const spyMapper = createSpy(({ args }) => args[0] * 2)
  const result = pipe(
    map(spyMapper),
    toArray
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
    'should iterate and map over iterable'
  )

  t.end()
})
