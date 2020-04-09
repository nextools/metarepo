import test from 'tape'
import { toObject } from '../src/to-object'

const ASCII_ALPHABET_OFFSET = 96

test('iterama: toObject', (t) => {
  const iterable = {
    *[Symbol.iterator]() {
      for (let i = 1; i <= 5; i++) {
        yield [String.fromCharCode(ASCII_ALPHABET_OFFSET + i), i] as const
      }
    },
  }
  const result = toObject(iterable)

  t.deepEquals(
    result,
    {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
    },
    'should convert iterable into object'
  )

  t.end()
})
