import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}
const multBy = (x: number) => (val: number) => val * x
const mult1 = multBy(1)
const mult2 = multBy(2)

test('iterama map: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof mult2 = createSpy(({ args }) => mult2(...args))
  const result = [...map(spy)(data)]

  t.deepEquals(result, [2, 4, 6, 8, 10])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [1, 0],
      [2, 1],
      [3, 2],
      [4, 3],
      [5, 4],
    ]
  )

  t.end()
})

test('works with Sets', (t) => {
  const data = new Set([1, 2, 3, 4, 5])
  const spy: typeof mult1 = createSpy(({ args }) => mult1(...args))

  for (const val of map(spy)(data)) {
    t.equals(data.has(val), true)
  }

  t.deepEquals(
    getSpyCalls(spy),
    [
      [1, 0],
      [2, 1],
      [3, 2],
      [4, 3],
      [5, 4],
    ]
  )

  t.end()
})

test('iterama map: works with Generators', (t) => {
  const iterator = gen(5)
  const spy: typeof mult2 = createSpy(({ args }) => mult2(...args))
  const result = [...map(spy)(iterator)]

  t.deepEquals(result, [0, 2, 4, 6, 8])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ]
  )

  t.end()
})

test('iterama map: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof mult2 = createSpy(({ args }) => mult2(...args))
  const result = [...pipe(map(mult2), map(spy))(data)]

  t.deepEquals(result, [4, 8, 12, 16, 20])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [2, 0],
      [4, 1],
      [6, 2],
      [8, 3],
      [10, 4],
    ]
  )

  t.end()
})
