import test from 'tape'
import { zip } from '../src/zip'
import { toArray } from '../src/to-array'

test('iterama: zip + same length', (t) => {
  const iterable1 = {
    *[Symbol.iterator]() {
      yield 1
      yield 2
      yield 3
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
  const result = toArray(
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

  t.end()
})

test('iterama: zip + different length', (t) => {
  const iterable1 = {
    *[Symbol.iterator]() {
      yield 1
      yield 2
      yield 3
    },
  }
  const iterable2 = {
    *[Symbol.iterator]() {
      yield '1'
      yield '2'
    },
  }
  const iterable3 = {
    *[Symbol.iterator]() {
      yield 'a'
    },
  }
  const result = toArray(
    zip(iterable1, iterable2, iterable3)
  )

  t.deepEquals(
    result,
    [
      [1, '1', 'a'],
    ],
    'should zip multiple iterables with minimal length'
  )

  t.end()
})
