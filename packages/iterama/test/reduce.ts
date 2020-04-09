import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { reduce } from '../src/reduce'
import { range } from '../src/range'

test('iterama: reduce', (t) => {
  const iterable = range(5)
  const add = (a: number, b: number): number => a + b
  const spyReducer: typeof add = createSpy(({ args }) => add(args[0], args[1]))
  const result = reduce(spyReducer, 0)(iterable)

  t.deepEquals(
    getSpyCalls(spyReducer),
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 2, 2],
      [3, 3, 3],
      [6, 4, 4],
    ],
    'should pass accumulator, value and counter to reducer function '
  )

  t.deepEquals(
    result,
    10,
    'should iterate and reduce over iterable'
  )

  t.end()
})
