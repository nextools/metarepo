import test from 'tape'
import { toValueAsync } from '../src/to-value-async'

test('iterama: toValueAsync', async (t) => {
  let hasReturned = false
  const iterable = {
    async *[Symbol.asyncIterator]() {
      try {
        yield await Promise.resolve(1)
        yield await Promise.resolve(2)
      } finally {
        hasReturned = true
      }
    },
  }
  const value = await toValueAsync(iterable)

  t.equals(
    value,
    1,
    'should return first value'
  )

  t.true(
    hasReturned,
    'should close iterator'
  )

  t.end()
})

test('iterama: toValueAsync + no return', async (t) => {
  const iterable = {
    [Symbol.asyncIterator]() {
      return {
        next() {
          return Promise.resolve({ value: 1, done: false })
        },
      }
    },
  }
  const value = await toValueAsync(iterable)

  t.equals(
    value,
    1,
    'should return first value'
  )

  t.end()
})
