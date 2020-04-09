import test from 'tape'
import { toMapAsync } from '../src/to-map-async'

const ASCII_ALPHABET_OFFSET = 96

test('iterama: toMapAsync', async (t) => {
  const iterable = {
    async *[Symbol.asyncIterator]() {
      for (let i = 1; i <= 5; i++) {
        yield await Promise.resolve([String.fromCharCode(ASCII_ALPHABET_OFFSET + i), i] as const)
      }
    },
  }
  const result = await toMapAsync(iterable)

  t.deepEquals(
    result,
    new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4],
      ['e', 5],
    ]),
    'should convert async iterable into map'
  )

  t.end()
})
