import { pipe } from 'funcom'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { filter } from '../src/filter'
import { range } from '../src/range'
import { take } from '../src/take'
import { toArray } from '../src/to-array'

test('iterama: filter', (t) => {
  const iterable = range(5)
  const isEven = (x: number) => x % 2 === 0
  const spyFilter: typeof isEven = createSpy(({ args }) => isEven(args[0]))
  const result = pipe(
    filter(spyFilter),
    toArray
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
    'should iterate and filter over iterable'
  )

  t.end()
})

test('iterama: filter closing', (t) => {
  let closed = false
  const iterable = {
    *[Symbol.iterator]() {
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
  const spyForEach: (n: number) => boolean = createSpy(({ args }) => args[0] % 2 === 0)
  const result = pipe(
    filter(spyForEach),
    take(2),
    toArray
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

  t.end()
})
