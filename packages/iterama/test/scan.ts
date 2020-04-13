import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from 'funcom'
import { scan } from '../src/scan'
import { toArray } from '../src/to-array'
import { range } from '../src/range'

test('iterama: scan', (t) => {
  const iterable = range(5)
  const add = (a: number, b: number): number => a + b
  const spyScanner: typeof add = createSpy(({ args }) => add(args[0], args[1]))
  const result = pipe(
    scan(spyScanner, 0),
    toArray
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
    'should iterate and scan over iterable'
  )

  t.end()
})
