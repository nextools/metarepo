import test from 'tape'
import { concatAsync } from '../src/concat-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: concatAsync', async (t) => {
  const iterable1 = {
    async *[Symbol.asyncIterator]() {
      for (let i = 1; i <= 5; i++) {
        yield await Promise.resolve(i)
      }
    },
  }
  const iterable2 = {
    async *[Symbol.asyncIterator]() {
      for (let i = 6; i <= 9; i++) {
        yield await Promise.resolve(i)
      }
    },
  }
  const result = await toArrayAsync(concatAsync(iterable1, iterable2))

  t.deepEquals(
    result,
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    'should concat 2 async iterables'
  )
})
