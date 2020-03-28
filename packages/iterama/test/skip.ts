import test from 'tape'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'
import { skip } from '../src/skip'
import { fi } from '../src/types'

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}
const multBy = (x: number) => (val: number) => val * x
const mult2 = multBy(2)

test('iterama skip: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...skip(2)(data)]

  t.deepEquals(result, [3, 4, 5])

  t.end()
})

test('iterama skip: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...pipe(skip(2) as fi<number>, map(mult2))(data)]

  t.deepEquals(result, [6, 8, 10])

  t.end()
})

test('iterama skip: works with Generators', (t) => {
  const data = gen(5)
  const result = [...skip(2)(data)]

  t.deepEquals(result, [2, 3, 4])

  t.end()
})

test('iterama skip: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...skip(-2)(data)]

  t.deepEquals(result, [1, 2, 3])

  t.end()
})

test('iterama skip: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...pipe(skip(-2) as fi<number>, map(mult2))(data)]

  t.deepEquals(result, [2, 4, 6])

  t.end()
})

test('iterama skip: works with Generators', (t) => {
  const data = gen(5)
  const result = [...skip(-2)(data)]

  t.deepEquals(result, [0, 1, 2])

  t.end()
})

test('iterama skip: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...skip(42)(data)]

  t.deepEquals(result, [])

  t.end()
})
test('iterama skip: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...skip(-42)(data)]

  t.deepEquals(result, [])

  t.end()
})
