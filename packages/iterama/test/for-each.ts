import { pipe } from 'funcom'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { forEach } from '../src/for-each'
import { range } from '../src/range'
import { take } from '../src/take'
import { toArray } from '../src/to-array'

test('iterama: forEach', (t) => {
  const iterable = range(5)
  const spyForEach = createSpy(() => {})
  const result = pipe(
    forEach(spyForEach),
    toArray
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
    'should pass iterable through'
  )

  t.end()
})

test('iterama: forEach closing', (t) => {
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
  const spyForEach = createSpy(() => {})
  const result = pipe(
    forEach(spyForEach),
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
    [0, 1, 2],
    'should pass iterable through'
  )

  t.true(
    closed,
    'should close iterable'
  )

  t.end()
})
