import test from 'tape'
import { iterate } from '../src/iterate'

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}

test('iterama iterate: should work with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = [...iterate(data)]

  t.deepEquals(result, [1, 2, 3, 4, 5])

  t.end()
})

test('iterama iterate: should work with Sets', (t) => {
  const data = new Set([1, 2, 3, 4, 5])
  const result = [...iterate(data)]

  t.deepEquals(result, [1, 2, 3, 4, 5])

  t.end()
})

test('iterama iterate: should work with Generators', (t) => {
  const data = gen(5)
  const result = [...iterate(data)]

  t.deepEquals(result, [0, 1, 2, 3, 4])

  t.end()
})
