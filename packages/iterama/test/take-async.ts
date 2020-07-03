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

test('iterama: takeAsync 0', async (t) => {
  const iterable = rangeAsync(5)
  const result = await pipe(
    takeAsync(0),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should take N first elements'
  )
})

test('iterama: takeFirst closing', async (t) => {
  let itClosed = false
  const iterable = {
    // eslint-disable-next-line require-await
    async *[Symbol.asyncIterator]() {
      try {
        yield 1
        yield 2
        yield 3
      } finally {
        itClosed = true
      }
    },
  }

  await pipe(
    takeAsync(2),
    takeAsync(1),
    toArrayAsync
  )(iterable)

  t.true(
    itClosed,
    'should close iterator'
  )
})

test('iterama: takeLast closing', async (t) => {
  let itClosed = false
  const iterable = {
    // eslint-disable-next-line require-await
    async *[Symbol.asyncIterator]() {
      try {
        yield 1
        yield 2
        yield 3
      } finally {
        itClosed = true
      }
    },
  }

  await pipe(
    takeAsync(-2),
    takeAsync(1),
    toArrayAsync
  )(iterable)

  t.true(
    itClosed,
    'should close iterator'
  )
})
