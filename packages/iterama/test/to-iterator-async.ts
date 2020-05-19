import test from 'tape'
import { toIteratorAsync } from '../src/to-iterator-async'

test('iterama: toIteratorAsync', async (t) => {
  const iterable = {
    async *[Symbol.asyncIterator]() {
      yield await Promise.resolve(1)
      yield await Promise.resolve(2)
      yield await Promise.resolve(3)
    },
  }
  const iterator = toIteratorAsync(iterable)
  const result = [
    await iterator.next(),
    await iterator.next(),
    await iterator.next(),
    await iterator.next(),
  ]

  t.deepEquals(
    result,
    [
      { value: 1, done: false },
      { value: 2, done: false },
      { value: 3, done: false },
      { value: undefined, done: true },
    ],
    'should return async iterable iterator'
  )
})
