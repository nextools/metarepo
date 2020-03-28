import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'
import { scanEx } from '../src/scan-ex'

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}
const add = (a = 0, b = 0) => a + b
const multBy = (x: number) => (val: number) => val * x
const mult2 = multBy(2)

test('iterama scanEx: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof add = createSpy(({ args }) => add(...args))
  const result = [...scanEx(spy, 0)(data)]

  t.deepEquals(result, [1, 3, 6, 10, 15])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [0, 1, 0, data],
      [1, 2, 1, data],
      [3, 3, 2, data],
      [6, 4, 3, data],
      [10, 5, 4, data],
    ]
  )

  t.end()
})

test('iterama scanEx: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof add = createSpy(({ args }) => add(...args))
  const result = [...pipe(scanEx(spy, 0), map(mult2))(data)]

  t.deepEquals(result, [2, 6, 12, 20, 30])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [0, 1, 0, data],
      [1, 2, 1, data],
      [3, 3, 2, data],
      [6, 4, 3, data],
      [10, 5, 4, data],
    ]
  )

  t.end()
})

test('iterama scanEx: works with Generators', (t) => {
  const data = gen(6)
  const spy: typeof add = createSpy(({ args }) => add(...args))
  const result = [...scanEx(spy, 0)(data)]

  t.deepEquals(result, [0, 1, 3, 6, 10, 15])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [0, 0, 0, data],
      [0, 1, 1, data],
      [1, 2, 2, data],
      [3, 3, 3, data],
      [6, 4, 4, data],
      [10, 5, 5, data],
    ]
  )

  t.end()
})
