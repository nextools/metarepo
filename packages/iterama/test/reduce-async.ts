import { pipe } from 'funcom'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { range } from '../src/range'
import { rangeAsync } from '../src/range-async'
import { reduceAsync } from '../src/reduce-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: reduceAsync', async (t) => {
  const iterable = rangeAsync(5)
  const add = (a: number, b: number): number => a + b
  const spyReducer: typeof add = createSpy(({ args }) => add(args[0], args[1]))
  const result = await pipe(
    reduceAsync(spyReducer, 0),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyReducer),
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 2, 2],
      [3, 3, 3],
      [6, 4, 4],
    ],
    'should pass accumulator, value and counter to reducer function'
  )

  t.deepEquals(
    result,
    [10],
    'should iterate and reduce over async iterable'
  )
})

test('iterama: reduceAsync with sync iterable', async (t) => {
  const iterable = range(5)
  const add = (a: number, b: number) => Promise.resolve(a + b)
  const spyReducer: typeof add = createSpy(({ args }) => add(args[0], args[1]))
  const result = await pipe(
    reduceAsync(spyReducer, 0),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyReducer),
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 2, 2],
      [3, 3, 3],
      [6, 4, 4],
    ],
    'should pass accumulator, value and counter to reducer function'
  )

  t.deepEquals(
    result,
    [10],
    'should iterate and reduce over async iterable'
  )
})
