import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'
import { filter } from '../src/filter'

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}
const multBy = (x: number) => (val: number) => val * x
const mult2 = multBy(2)
const isEven = (x: number) => x % 2 === 0

test('iterama filter: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof isEven = createSpy(({ args }) => isEven(...args))
  const result = [...filter(spy)(data)]

  t.deepEquals(result, [2, 4])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [1],
      [2],
      [3],
      [4],
      [5],
    ]
  )

  t.end()
})

test('iterama filter: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const spy: typeof isEven = createSpy(({ args }) => isEven(...args))
  const result = [...pipe(filter(spy), map(mult2))(data)]

  t.deepEquals(result, [4, 8])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [1],
      [2],
      [3],
      [4],
      [5],
    ]
  )

  t.end()
})

test('iterama filter: works with Generators', (t) => {
  const iterator = gen(5)
  const spy: typeof isEven = createSpy(({ args }) => isEven(...args))
  const result = [...filter(spy)(iterator)]

  t.deepEquals(result, [0, 2, 4])
  t.deepEquals(
    getSpyCalls(spy),
    [
      [0],
      [1],
      [2],
      [3],
      [4],
    ]
  )

  t.end()
})
