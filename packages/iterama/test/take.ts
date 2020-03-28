import test from 'tape'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'
import { take } from '../src/take'

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}
const multBy = (x: number) => (val: number) => val * x
const mult2 = multBy(2)

test('iterama take: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...take(3)(data)]

  t.deepEquals(result, [1, 2, 3])

  t.end()
})

test('iterama take: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...pipe(map(mult2), take(2))(data)]

  t.deepEquals(result, [2, 4])

  t.end()
})

test('iterama take: works with Generators', (t) => {
  const data = gen(5)
  const result = [...take(2)(data)]

  t.deepEquals(result, [0, 1])

  t.end()
})

test('iterama take: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...take(-2)(data)]

  t.deepEquals(result, [4, 5])

  t.end()
})

test('iterama take: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...pipe(map(mult2), take(-2))(data)]

  t.deepEquals(result, [8, 10])

  t.end()
})

test('iterama take: works with Generators', (t) => {
  const data = gen(5)
  const result = [...take(-2)(data)]

  t.deepEquals(result, [3, 4])

  t.end()
})

test('iterama take: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...take(42)(data)]

  t.deepEquals(result, [1, 2, 3, 4, 5])

  t.end()
})

test('iterama take: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...take(-42)(data)]

  t.deepEquals(result, [1, 2, 3, 4, 5])

  t.end()
})
