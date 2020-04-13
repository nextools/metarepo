import test from 'tape'
import { pipe } from 'funcom'
import { toArrayAsync } from '../src/to-array-async'
import { uniqueAsync } from '../src/unique-async'

test('iterama: uniqueAsync', async (t) => {
  const iterable = {
    async *[Symbol.asyncIterator]() {
      yield await Promise.resolve(1)
      yield await Promise.resolve(1)
      yield await Promise.resolve(3)
      yield await Promise.resolve(4)
      yield await Promise.resolve(3)
    },
  }
  const result = await pipe(
    uniqueAsync,
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [1, 3, 4],
    'should keep only unique elements'
  )

  t.end()
})
