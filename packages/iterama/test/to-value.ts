import test from 'tape'
import { toValue } from '../src/to-value'

test('iterama: toValue', (t) => {
  let hasClosed = false
  const iterable = {
    *[Symbol.iterator]() {
      try {
        yield 1
        yield 2
      } finally {
        hasClosed = true
      }
    },
  }
  const value = toValue(iterable)

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

test('iterama: toValue + no return', (t) => {
  const iterable = [1, 2]
  const value = toValue(iterable)

  t.equals(
    value,
    1,
    'should return first value'
  )

  t.end()
})

test('iterama: toValue + no return', (t) => {
  const iterable = [1, 2]
  const value = toValue(iterable)

  t.equals(
    value,
    1,
    'should return first value'
  )

  t.end()
})
