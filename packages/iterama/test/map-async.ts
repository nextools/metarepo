import { pipe } from 'funcom'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { mapAsync } from '../src/map-async'
import { range } from '../src/range'
import { rangeAsync } from '../src/range-async'
import { takeAsync } from '../src/take-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: mapAsync', async (t) => {
  const iterable = rangeAsync(5)
  const spyMapper = createSpy(({ args }) => Promise.resolve(args[0] * 2))
  const result = await pipe(
    mapAsync(spyMapper),
    toArrayAsync
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
    'should iterate and map over async iterable'
  )
})

test('iterama: mapAsync with sync iterable', async (t) => {
  const iterable = range(5)
  const spyMapper = createSpy(({ args }) => Promise.resolve(args[0] * 2))
  const result = await pipe(
    mapAsync(spyMapper),
    toArrayAsync
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
    'should iterate and map over async iterable'
  )
})

test('iterama: mapAsync closing', async (t) => {
  let closed = false
  const iterable = {
    // eslint-disable-next-line require-await
    async *[Symbol.asyncIterator]() {
      try {
        yield 0
        yield 1
        yield 2
        yield 3
        yield 4
      } finally {
        closed = true
      }
    },
  }
  const spyForEach = createSpy(({ args }) => args[0] * 2)
  const result = await pipe(
    mapAsync(spyForEach),
    takeAsync(3),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyForEach),
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    'should pass value and counter to forEach function'
  )

  t.deepEquals(
    result,
    [0, 2, 4],
    'should pass iterable through'
  )

  t.true(
    closed,
    'should close iterable'
  )
})
