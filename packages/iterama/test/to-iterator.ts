import test from 'tape'
import { toIterator } from '../src/to-iterator'

test('iterama: toIterator', (t) => {
  const iterable = {
    *[Symbol.iterator]() {
      yield 1
      yield 2
      yield 3
    },
  }
  const iterator = toIterator(iterable)
  const result = [
    iterator.next(),
    iterator.next(),
    iterator.next(),
    iterator.next(),
  ]

  t.deepEquals(
    result,
    [
      { value: 1, done: false },
      { value: 2, done: false },
      { value: 3, done: false },
      { value: undefined, done: true },
    ],
    'should return iterable iterator'
  )

  t.end()
})
