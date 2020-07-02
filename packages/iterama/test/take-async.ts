import { pipe } from 'funcom'
import test from 'tape'
import { rangeAsync } from '../src/range-async'
import { takeAsync } from '../src/take-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: takeAsync + positive number', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    takeAsync(3),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2],
    'should take N first elements'
  )
})

test('iterama: takeAsync + negative number', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    takeAsync(-3),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [2, 3, 4],
    'should take N last elements'
  )
})

test('iterama: takeAsync + more than needed', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    takeAsync(42),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should take all elements'
  )
})

test('iterama: takeAsync + negative more than needed', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    takeAsync(-42),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should take all elements'
  )
})
