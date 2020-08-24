import { pipe } from 'funcom'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { map } from '../src/map'
import { range } from '../src/range'
import { take } from '../src/take'
import { toArray } from '../src/to-array'

test('iterama: map', (t) => {
  const iterable = range(5)
  const spyMapper = createSpy(({ args }) => args[0] * 2)
  const result = pipe(
    map(spyMapper),
    toArray
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
    'should iterate and map over iterable'
  )

  t.end()
})

test('iterama: map closing', (t) => {
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
  const spyForEach = createSpy(({ args }) => args[0] * 2)
  const result = pipe(
    map(spyForEach),
    take(3),
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
    [0, 2, 4],
    'should pass iterable through'
  )

  t.true(
    closed,
    'should close iterable'
  )

  t.end()
})
