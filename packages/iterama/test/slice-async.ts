import test from 'tape'
import { pipe } from '@psxcode/compose'
import { sliceAsync } from '../src/slice-async'
import { toArrayAsync } from '../src/to-array-async'
import { rangeAsync } from '../src/range-async'

test('iterama: sliceAsync + no args', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should not skip and take all'
  )
})

test('iterama: sliceAsync + from', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(1),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [1, 2, 3, 4],
    'should skip and take the rest'
  )
})

test('iterama: sliceAsync + from + to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(1, 3),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [1, 2, 3],
    'should skip and take'
  )
})

test('iterama: sliceAsync + from + negative to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(1, -1),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [1, 2, 3],
    'should skip and take last'
  )
})

test('iterama: sliceAsync + negative from + to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(-3, 2),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [2, 3],
    'should skip from end and take'
  )
})

test('iterama: sliceAsync + negative from + negative to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(-3, -1),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [2, 3],
    'should skip from end and take last'
  )
})

test('iterama: sliceAsync + more than needed from + to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(42, 2),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip all and take nothing'
  )
})

test('iterama: sliceAsync + more than needed negative from + to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(-42, 2),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [0, 1],
    'should skip all from end and take'
  )
})

test('iterama: sliceAsync + from + more than needed to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(2, 42),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [2, 3, 4],
    'should skip and take the rest'
  )
})

test('iterama: sliceAsync + from + more than needed negative to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(2, -42),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip and take nothing including skipped'
  )
})

test('iterama: sliceAsync + more than needed from + more than needed to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(42, 42),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip all and take nothing'
  )
})

test('iterama: sliceAsync + more than needed negative from + more than needed to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(-42, 42),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should skip all from end and take the rest'
  )
})

test('iterama: sliceAsync + more than needed from + more than needed negative to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(42, -42),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip all and take all last'
  )
})

test('iterama: sliceAsync + more than needed negative from + more than needed negative to', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    sliceAsync(-42, -42),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip all from end and take all last'
  )
})
