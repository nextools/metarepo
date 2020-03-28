import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'
import { reduce } from '../src/reduce'

export const add = (a = 0, b = 0) => a + b

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}
const multBy = (x: number) => (val: number) => val * x
const mult2 = multBy(2)

test('iterama reduce: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof add = createSpy(({ args }) => add(...args))
  const result = [...reduce(spy)(data)]

  t.deepEquals(result, [15])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [],
      [0, 1],
      [1, 2],
      [3, 3],
      [6, 4],
      [10, 5],
    ]
  )

  t.end()
})

test('iterama reduce: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof add = createSpy(({ args }) => add(...args))
  const result = [...pipe(reduce(spy), map(mult2))(data)]

  t.deepEquals(result, [30])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [],
      [0, 1],
      [1, 2],
      [3, 3],
      [6, 4],
      [10, 5],
    ]
  )

  t.end()
})

test('iterama reduce: works with Generators', (t) => {
  const data = gen(6)
  const spy: typeof add = createSpy(({ args }) => add(...args))
  const result = [...reduce(spy)(data)]

  t.deepEquals(result, [15])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [],
      [0, 0],
      [0, 1],
      [1, 2],
      [3, 3],
      [6, 4],
      [10, 5],
    ]
  )

  t.end()
})
