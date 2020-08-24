import test from 'tape'
import { zip } from '../src/zip'

test('iterama: zip + same length', (t) => {
  let hasClosed = false
  const iterable1 = {
    *[Symbol.iterator]() {
      try {
        yield 1
        yield 2
        yield 3
      } finally {
        hasClosed = true
      }
    },
  }
  const iterable2 = {
    *[Symbol.iterator]() {
      yield '1'
      yield '2'
      yield '3'
    },
  }
  const iterable3 = {
    *[Symbol.iterator]() {
      yield 'a'
      yield 'b'
      yield 'c'
    },
  }
  const result = Array.from(
    zip(iterable1, iterable2, iterable3)
  )

  t.deepEquals(
    result,
    [
      [1, '1', 'a'],
      [2, '2', 'b'],
      [3, '3', 'c'],
    ],
    'should zip multiple iterables'
  )

  t.true(
    hasClosed,
    'should close iterator'
  )

  t.end()
})

test('iterama: zip + different length', (t) => {
  let hasClosed = false
  const iterable1 = {
    *[Symbol.iterator]() {
      try {
        yield 1
        yield 2
        yield 3
      } finally {
        hasClosed = true
      }
    },
  }
  const iterable2 = ['1', '2']
  const iterable3 = ['a']

  const result = Array.from(
    zip(iterable1, iterable2, iterable3)
  )

  t.deepEquals(
    result,
    [
      [1, '1', 'a'],
    ],
    'should zip multiple iterables with minimal length'
  )

  t.true(
    hasClosed,
    'should close iterator'
  )

  t.end()
})
