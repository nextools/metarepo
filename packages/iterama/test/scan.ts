import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'
import { scan } from '../src/scan'

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}
const add = (a: number, b: number) => a + b
const multBy = (x: number) => (val: number) => val * x
const mult2 = multBy(2)

test('iterama scan: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof add = createSpy(({ args }) => add(...args))
  const result = [...scan(spy, 0)(data)]

  t.deepEquals(result, [1, 3, 6, 10, 15])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [0, 1, 0],
      [1, 2, 1],
      [3, 3, 2],
      [6, 4, 3],
      [10, 5, 4],
    ]
  )

  t.end()
})

test('iterama scan: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof add = createSpy(({ args }) => add(...args))
  const result = [...pipe(scan(spy, 0), map(mult2))(data)]

  t.deepEquals(result, [2, 6, 12, 20, 30])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [0, 1, 0],
      [1, 2, 1],
      [3, 3, 2],
      [6, 4, 3],
      [10, 5, 4],
    ]
  )

  t.end()
})

test('iterama scan: works with Generators', (t) => {
  const data = gen(6)
  const spy: typeof add = createSpy(({ args }) => add(...args))
  const result = [...scan(spy, 0)(data)]

  t.deepEquals(result, [0, 1, 3, 6, 10, 15])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 2, 2],
      [3, 3, 3],
      [6, 4, 4],
      [10, 5, 5],
    ]
  )

  t.end()
})
