import { pipe } from 'funcom'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { forEachAsync } from '../src/for-each-async'
import { range } from '../src/range'
import { rangeAsync } from '../src/range-async'
import { takeAsync } from '../src/take-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: forEachAsync', async (t) => {
  const iterable = rangeAsync(5)
  const spyForEach = createSpy(() => {})
  const result = await pipe(
    forEachAsync(spyForEach),
    toArrayAsync
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
    'should pass async iterable through'
  )
})

test('iterama: forEachAsync with sync iterable', async (t) => {
  const iterable = range(5)
  const spyForEach: (n: number) => Promise<void> = createSpy(() => Promise.resolve())
  const result = await pipe(
    forEachAsync(spyForEach),
    toArrayAsync
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
    'should pass async iterable through'
  )
})

test('iterama: forEachAsync closing', async (t) => {
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
  const spyForEach = createSpy(() => {})
  const result = await pipe(
    forEachAsync(spyForEach),
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
    [0, 1, 2],
    'should pass iterable through'
  )

  t.true(
    closed,
    'should close iterable'
  )
})
