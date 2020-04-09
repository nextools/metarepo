import test from 'tape'
import { toMap } from '../src/to-map'

const ASCII_ALPHABET_OFFSET = 96

test('iterama: toMap', (t) => {
  const iterable = {
    *[Symbol.iterator]() {
      for (let i = 1; i <= 5; i++) {
        yield [String.fromCharCode(ASCII_ALPHABET_OFFSET + i), i] as const
      }
    },
  }
  const result = toMap(iterable)

  t.deepEquals(
    result,
    new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4],
      ['e', 5],
    ]),
    'should convert iterable into map'
  )

  t.end()
})
