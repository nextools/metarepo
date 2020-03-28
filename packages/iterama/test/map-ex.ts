import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from '@psxcode/compose'
import { mapEx } from '../src/map-ex'

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}
const multBy = (x: number) => (val: number) => val * x
const mult1 = multBy(1)
const mult2 = multBy(2)

test('iterama mapEx: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof mult2 = createSpy(({ args }) => mult2(...args))
  const result = [...mapEx(spy)(data)]

  t.deepEquals(result, [2, 4, 6, 8, 10])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [1, 0, data],
      [2, 1, data],
      [3, 2, data],
      [4, 3, data],
      [5, 4, data],
    ]
  )

  t.end()
})

test('iterama mapEx: works with Sets', (t) => {
  const data = new Set([1, 2, 3, 4, 5])
  const spy: typeof mult1 = createSpy(({ args }) => mult1(...args))

  for (const val of mapEx(spy)(data)) {
    t.equals(data.has(val), true)
  }

  t.deepEquals(
    getSpyCalls(spy),
    [
      [1, 0, data],
      [2, 1, data],
      [3, 2, data],
      [4, 3, data],
      [5, 4, data],
    ]
  )

  t.end()
})

test('iterama mapEx: works with Generators', (t) => {
  const iterator = gen(5)
  const spy: typeof mult2 = createSpy(({ args }) => mult2(...args))
  const result = [...mapEx(spy)(iterator)]

  t.deepEquals(result, [0, 2, 4, 6, 8])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [0, 0, iterator],
      [1, 1, iterator],
      [2, 2, iterator],
      [3, 3, iterator],
      [4, 4, iterator],
    ]
  )

  t.end()
})

test('iterama mapEx: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof mult2 = createSpy(({ args }) => mult2(...args))
  const result = [...pipe(mapEx(mult2), mapEx(spy))(data)]

  t.deepEquals(result, [4, 8, 12, 16, 20])
  /* cannot compare intermediate iterable created by first mapEx */
  // t.deepEquals(spy.calls, [
  //   [2, 0, {}],
  //   [4, 1, {}],
  //   [6, 2, {}],
  //   [8, 3, {}],
  //   [10, 4, {}],
  // ])

  t.end()
})
