import { pipe } from 'funcom'
import test from 'tape'
import { rangeAsync } from '../src/range-async'
import { skipAsync } from '../src/skip-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: skipAsync first', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    skipAsync(2),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [2, 3, 4],
    'should skip first iterations'
  )
})

test('iterama: skipAsync more than needed', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    skipAsync(42),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip everything'
  )
})

test('iterama: skipAsync last', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    skipAsync(-2),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2],
    'should skip last iterations'
  )
})

test('iterama: skipAsync last more than needed', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    skipAsync(-42),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip everything'
  )
})
