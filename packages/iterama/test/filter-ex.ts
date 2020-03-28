import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'
import { filterEx } from '../src/filter-ex'

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}
const multBy = (x: number) => (val: number) => val * x
const mult2 = multBy(2)
const isEven = (x: number) => x % 2 === 0

test('iterama filterEx: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof isEven = createSpy(({ args }) => isEven(...args))
  const result = [...filterEx(spy)(data)]

  t.deepEquals(result, [2, 4])
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

test('iterama filterEx: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof isEven = createSpy(({ args }) => isEven(...args))
  const result = [...pipe(filterEx(spy), map(mult2))(data)]

  t.deepEquals(result, [4, 8])
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

test('iterama filterEx: works with Generators', (t) => {
  const iterator = gen(5)
  const spy: typeof isEven = createSpy(({ args }) => isEven(...args))
  const result = [...filterEx(spy)(iterator)]

  t.deepEquals(result, [0, 2, 4])
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
