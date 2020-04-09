import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { reduceAsync } from '../src/reduce-async'
import { rangeAsync } from '../src/range-async'

test('iterama: reduceAsync', async (t) => {
  const iterable = rangeAsync(5)
  const add = (a: number, b: number): number => a + b
  const spyReducer: typeof add = createSpy(({ args }) => add(args[0], args[1]))
  const result = await reduceAsync(spyReducer, 0)(iterable)

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
    'should iterate and reduce over async iterable'
  )
})
