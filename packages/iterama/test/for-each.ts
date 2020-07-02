import { pipe } from 'funcom'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { forEach } from '../src/for-each'
import { range } from '../src/range'
import { toArray } from '../src/to-array'

test('iterama: forEach', (t) => {
  const iterable = range(5)
  const spyForEach = createSpy(() => {})
  const result = pipe(
    forEach(spyForEach),
    toArray
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
    'should pass iterable through'
  )

  t.end()
})
