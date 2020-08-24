import test from 'tape'
import { toArrayAsync } from '../src/to-array-async'
import { zipAsync } from '../src/zip-async'

test('iterama: zipAsync + same length', async (t) => {
  const iterable1 = {
    async *[Symbol.asyncIterator]() {
      yield await Promise.resolve(1)
      yield await Promise.resolve(2)
      yield await Promise.resolve(3)
    },
  }
  const iterable2 = {
    async *[Symbol.asyncIterator]() {
      yield await Promise.resolve('1')
      yield await Promise.resolve('2')
      yield await Promise.resolve('3')
    },
  }
  const iterable3 = {
    async *[Symbol.asyncIterator]() {
      yield await Promise.resolve('a')
      yield await Promise.resolve('b')
      yield await Promise.resolve('c')
    },
  }
  const result = await toArrayAsync(
    zipAsync(iterable1, iterable2, iterable3)
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
})

test('iterama: zipAsync + different length', async (t) => {
  let hasClosed = false
  const iterable1 = {
    async *[Symbol.asyncIterator]() {
      try {
        yield await Promise.resolve(1)
        yield await Promise.resolve(2)
        yield await Promise.resolve(3)
      } finally {
        hasClosed = true
      }
    },
  }
  const iterable2 = {
    async *[Symbol.asyncIterator]() {
      yield await Promise.resolve('1')
      yield await Promise.resolve('2')
    },
  }
  const iterable3 = {
    [Symbol.asyncIterator]() {
      let done = false

      return {
        // eslint-disable-next-line require-await
        async next() {
          // eslint-disable-next-line no-return-assign
          return done
            ? { value: undefined, done: true }
            : (done = true, { value: 'a', done: false })
        },
      }
    },
  }
  const result = await toArrayAsync(
    zipAsync(iterable1, iterable2, iterable3)
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
