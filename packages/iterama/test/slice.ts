import test from 'tape'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'
import { slice } from '../src/slice'

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}
const multBy = (x: number) => (val: number) => val * x
const mult2 = multBy(2)

test('iterama slice: skip \'to\' param', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice(1)(data)]

  t.deepEquals(result, [2, 3, 4, 5])

  t.end()
})

test('iterama slice: skip both params', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice()(data)]

  t.deepEquals(result, [1, 2, 3, 4, 5])

  t.end()
})

test('iterama slice: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice(1, 3)(data)]

  t.deepEquals(result, [2, 3, 4])

  t.end()
})

test('iterama slice: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...pipe(map(mult2), slice(2, 2))(data)]

  t.deepEquals(result, [6, 8])

  t.end()
})

test('iterama slice: works with Generators', (t) => {
  const data = gen(5)
  const result = [...slice(2, 1)(data)]

  t.deepEquals(result, [2])

  t.end()
})

test('iterama slice: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice(1, -1)(data)]

  t.deepEquals(result, [2, 3, 4])

  t.end()
})

test('iterama slice: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...pipe(map(mult2), slice(2, -1))(data)]

  t.deepEquals(result, [6, 8])

  t.end()
})

test('iterama slice: works with Generators', (t) => {
  const data = gen(5)
  const result = [...slice(2, -1)(data)]

  t.deepEquals(result, [2, 3])

  t.end()
})

test('iterama slice: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice(-3, 2)(data)]

  t.deepEquals(result, [3, 4])

  t.end()
})

test('iterama slice: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...pipe(map(mult2), slice(-3, 2))(data)]

  t.deepEquals(result, [6, 8])

  t.end()
})

test('iterama slice: works with Generators', (t) => {
  const data = gen(5)
  const result = [...slice(-3, 2)(data)]

  t.deepEquals(result, [2, 3])

  t.end()
})

test('iterama slice: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice(-3, -1)(data)]

  t.deepEquals(result, [3, 4])

  t.end()
})

test('iterama slice: works chained', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...pipe(map(mult2), slice(-3, -1))(data)]

  t.deepEquals(result, [6, 8])

  t.end()
})

test('iterama slice: works with Generators', (t) => {
  const data = gen(5)
  const result = [...slice(-3, -1)(data)]

  t.deepEquals(result, [2, 3])

  t.end()
})

test('iterama slice: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice(2, 42)(data)]

  t.deepEquals(result, [3, 4, 5])

  t.end()
})

test('iterama slice: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice(42, -2)(data)]

  t.deepEquals(result, [])

  t.end()
})

test('iterama slice: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice(-42, 2)(data)]

  t.deepEquals(result, [1, 2])

  t.end()
})

test('iterama slice: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice(-42, -2)(data)]

  t.deepEquals(result, [1, 2, 3])

  t.end()
})

test('iterama slice: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice(-42, 42)(data)]

  t.deepEquals(result, [1, 2, 3, 4, 5])

  t.end()
})

test('iterama slice: works with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...slice(-42, -42)(data)]

  t.deepEquals(result, [])

  t.end()
})
