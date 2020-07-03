import { pipe } from 'funcom'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { range } from '../src/range'
import { rangeAsync } from '../src/range-async'
import { scanAsync } from '../src/scan-async'
import { takeAsync } from '../src/take-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: scanAsync', async (t) => {
  const iterable = rangeAsync(5)
  const add = (a: number, b: number): number => a + b
  const spyScanner: typeof add = createSpy(({ args }) => add(args[0], args[1]))
  const result = await pipe(
    scanAsync(spyScanner, 0),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyScanner),
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 2, 2],
      [3, 3, 3],
      [6, 4, 4],
    ],
    'should pass accumulator, value and counter to scanner function'
  )

  t.deepEquals(
    result,
    [0, 1, 3, 6, 10],
    'should iterate and scan over async iterable'
  )
})

test('iterama: scanAsync with sync iterable', async (t) => {
  const iterable = range(5)
  const add = (a: number, b: number) => Promise.resolve(a + b)
  const spyScanner: typeof add = createSpy(({ args }) => add(args[0], args[1]))
  const result = await pipe(
    scanAsync(spyScanner, 0),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyScanner),
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 2, 2],
      [3, 3, 3],
      [6, 4, 4],
    ],
    'should pass accumulator, value and counter to scanner function'
  )

  t.deepEquals(
    result,
    [0, 1, 3, 6, 10],
    'should iterate and scan over async iterable'
  )
})

test('iterama: scanAsync closing', async (t) => {
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
  const add = (a: number, b: number): number => a + b
  const spyScanner: typeof add = createSpy(({ args }) => add(args[0], args[1]))
  const result = await pipe(
    scanAsync(spyScanner, 0),
    takeAsync(3),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyScanner),
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 2, 2],
    ],
    'should pass accumulator, value and counter to scanner function'
  )

  t.deepEquals(
    result,
    [0, 1, 3],
    'should iterate and scan over iterable'
  )

  t.true(
    closed,
    'should close iterable'
  )
})
