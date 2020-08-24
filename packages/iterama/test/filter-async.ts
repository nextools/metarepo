import { pipe } from 'funcom'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { filterAsync } from '../src/filter-async'
import { range } from '../src/range'
import { rangeAsync } from '../src/range-async'
import { takeAsync } from '../src/take-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: filterAsync', async (t) => {
  const iterable = rangeAsync(5)
  const isEven = (x: number) => Promise.resolve(x % 2 === 0)
  const spyFilter: typeof isEven = createSpy(({ args }) => isEven(args[0]))
  const result = await pipe(
    filterAsync(spyFilter),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyFilter),
    [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ],
    'should pass value and counter to filter function'
  )

  t.deepEquals(
    result,
    [0, 2, 4],
    'should iterate and filter over async iterable'
  )
})

test('iterama: filterAsync with sync iterable', async (t) => {
  const iterable = range(5)
  const isEven = (x: number) => Promise.resolve(x % 2 === 0)
  const spyFilter: typeof isEven = createSpy(({ args }) => isEven(args[0]))
  const result = await pipe(
    filterAsync(spyFilter),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyFilter),
    [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ],
    'should pass value and counter to filter function'
  )

  t.deepEquals(
    result,
    [0, 2, 4],
    'should iterate and filter over async iterable'
  )
})

test('iterama: filterAsync closing', async (t) => {
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
  const isEven = (x: number) => Promise.resolve(x % 2 === 0)
  const spyForEach: typeof isEven = createSpy(({ args }) => isEven(args[0]))
  const result = await pipe(
    filterAsync(spyForEach),
    takeAsync(2),
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
    [0, 2],
    'should pass iterable through'
  )

  t.true(
    closed,
    'should close iterable'
  )
})
