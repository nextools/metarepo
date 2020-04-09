import test from 'tape'
import { pipe } from '@psxcode/compose'
import { distinctAsync } from '../src/distinct-async'
import { toArrayAsync } from '../src/to-array-async'

test('iterama: distinctAsync', async (t) => {
  const iterable = {
    async *[Symbol.asyncIterator]() {
      yield await Promise.resolve()
      yield await Promise.resolve(1)
      yield await Promise.resolve(1)
      yield await Promise.resolve(3)
      yield await Promise.resolve(3)
      yield await Promise.resolve(4)
      yield await Promise.resolve()
      yield await Promise.resolve()
      yield await Promise.resolve(3)
    },
  }
  const result = await pipe(
    distinctAsync,
    toArrayAsync
  )(iterable)

  t.deepEquals(
    result,
    [undefined, 1, 3, 4, undefined, 3],
    'should iterate and distinct over async iterable'
  )
})

