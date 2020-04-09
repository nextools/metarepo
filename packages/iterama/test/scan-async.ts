import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from '@psxcode/compose'
import { scanAsync } from '../src/scan-async'
import { toArrayAsync } from '../src/to-array-async'
import { rangeAsync } from '../src/range-async'

test('iterama: scanAsync', async (t) => {
  const iterable = rangeAsync(5)
  const add = (a: number, b: number): number => a + b
  const spyScanner: typeof add = createSpy(({ args }) => add(args[0], args[1]))
  const result = await pipe(
    scanAsync(spyScanner, 0),
    toArrayAsync
  )(iterable)

  t.deepEquals(
    getSpyCalls(spyScanner),
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 2, 2],
      [3, 3, 3],
      [6, 4, 4],
    ],
    'should pass accumulator, value and counter to scanner function '
  )

  t.deepEquals(
    result,
    [0, 1, 3, 6, 10],
    'should iterate and scan over async iterable'
  )
})
