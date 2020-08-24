import { pipe } from 'funcom'
import test from 'tape'
import { range } from '../src/range'
import { take } from '../src/take'
import { toArray } from '../src/to-array'

test('iterama: take + positive number', (t) => {
  const iterable = range(5)
  const result = pipe(
    take(3),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2],
    'should take N first elements'
  )

  t.end()
})

test('iterama: take + negative number', (t) => {
  const iterable = range(5)
  const result = pipe(
    take(-3),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [2, 3, 4],
    'should take N last elements'
  )

  t.end()
})

test('iterama: take + more than needed', (t) => {
  const iterable = range(5)
  const result = pipe(
    take(42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should take all elements'
  )

  t.end()
})

test('iterama: take + negative more than needed', (t) => {
  const iterable = range(5)
  const result = pipe(
    take(-42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should take all elements'
  )

  t.end()
})

test('iterama: take 0', (t) => {
  const iterable = range(5)
  const result = pipe(
    take(0),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should take N first elements'
  )

  t.end()
})

test('iterama: takeFirst closing', (t) => {
  let itClosed = false
  const iterable = {
    *[Symbol.iterator]() {
      try {
        yield 1
        yield 2
        yield 3
      } finally {
        itClosed = true
      }
    },
  }

  const result = pipe(
    take(2),
    take(1),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [1],
    'should take elements'
  )

  t.true(
    itClosed,
    'should close iterator'
  )

  t.end()
})

test('iterama: takeLast closing', (t) => {
  let itClosed = false
  const iterable = {
    *[Symbol.iterator]() {
      try {
        yield 1
        yield 2
        yield 3
      } finally {
        itClosed = true
      }
    },
  }

  const result = pipe(
    take(-2),
    take(1),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [2],
    'should take elements'
  )

  t.true(
    itClosed,
    'should close iterator'
  )

  t.end()
})
