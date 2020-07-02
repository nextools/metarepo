import { pipe } from 'funcom'
import test from 'tape'
import { range } from '../src/range'
import { skip } from '../src/skip'
import { take } from '../src/take'
import { toArray } from '../src/to-array'

test('iterama: skip first', (t) => {
  const iterable = range(5)
  const result = pipe(
    skip(2),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [2, 3, 4],
    'should skip first iterations'
  )

  t.end()
})

test('iterama: skip first more than needed', (t) => {
  const iterable = range(5)
  const result = pipe(
    skip(42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip everything'
  )

  t.end()
})

test('iterama: skip last', (t) => {
  const iterable = range(5)
  const result = pipe(
    skip(-2),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2],
    'should skip last iterations'
  )

  t.end()
})

test('iterama: skip last more than needed', (t) => {
  const iterable = range(5)
  const result = pipe(
    skip(-42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip everything'
  )

  t.end()
})

test('iterama: skipFirst closing', (t) => {
  let hasClosed = false
  const iterable = {
    *[Symbol.iterator]() {
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
  const result = pipe(
    skip(1),
    take(1),
    toArray
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

  t.end()
})

test('iterama: skipLast closing', (t) => {
  let hasClosed = false
  const iterable = {
    *[Symbol.iterator]() {
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
  const result = pipe(
    skip(-1),
    take(1),
    toArray
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

  t.end()
})
