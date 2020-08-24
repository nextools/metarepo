import { pipe } from 'funcom'
import test from 'tape'
import { rangeAsync } from '../src/range-async'
import { skipAsync } from '../src/skip-async'
import { takeAsync } from '../src/take-async'
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

test('iterama: skipFirst closing', async (t) => {
  let hasClosed = false
  const iterable = {
    // eslint-disable-next-line require-await
    async *[Symbol.asyncIterator]() {
      try {
        yield 0
        yield 1
        yield 2
        yield 2
      } finally {
        hasClosed = true
      }
    },
  }
  const result = await pipe(
    skipAsync(1),
    takeAsync(1),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [1],
    'should skip everything'
  )

  t.true(
    hasClosed,
    'should close iterator'
  )
})

test('iterama: skipLast closing', async (t) => {
  let hasClosed = false
  const iterable = {
    // eslint-disable-next-line require-await
    async *[Symbol.asyncIterator]() {
      try {
        yield 0
        yield 1
        yield 2
        yield 2
      } finally {
        hasClosed = true
      }
    },
  }
  const result = await pipe(
    skipAsync(-1),
    takeAsync(1),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [0],
    'should skip everything'
  )

  t.true(
    hasClosed,
    'should close iterator'
  )
})
