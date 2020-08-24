import test from 'tape'
import { toValueAsync } from '../src/to-value-async'

test('iterama: toValueAsync', async (t) => {
  let hasClosed = false
  const iterable = {
    async *[Symbol.asyncIterator]() {
      try {
        yield await Promise.resolve(1)
        yield await Promise.resolve(2)
      } finally {
        hasClosed = true
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
    hasClosed,
    'should close iterator'
  )

  t.end()
})

test('iterama: toValueAsync + no closing', async (t) => {
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

test('iterama: toValueAsync empty collection', async (t) => {
  const iterable = {
    [Symbol.asyncIterator]() {
      return {
        next() {
          return Promise.resolve({ value: undefined, done: true })
        },
      }
    },
  }
  const value = await toValueAsync(iterable)

  t.equals(
    value,
    undefined,
    'should return undefined'
  )

  t.end()
})
