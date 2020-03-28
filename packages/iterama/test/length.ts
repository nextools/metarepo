import test from 'tape'
import { length } from '../src/length'

const gen = function *(n: number) {
  for (let i = 0; i < n; ++i) {
    yield i
  }
}

test('iterama length: should work with arrays', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = length(Number.MAX_SAFE_INTEGER)(data)

  t.equals(result, data.length)

  t.end()
})

test('iterama length: should work with maxLength', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = length(2)(data)

  t.equals(result, 2)

  t.end()
})

test('iterama length: should work negative maxLength', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = length(-2)(data)

  t.equals(result, 0)

  t.end()
})

test('iterama length: should work maxLength === 0', (t) => {
  const data = [1, 2, 3, 4, 5]
  const result = length(0)(data)

  t.equals(result, 0)

  t.end()
})

test('iterama length: should work with Sets', (t) => {
  const data = new Set([1, 2, 3, 4, 5])
  const result = length(Number.MAX_SAFE_INTEGER)(data)

  t.equals(result, 5)

  t.end()
})

test('iterama length: should work with Generators', (t) => {
  const data = gen(5)
  const result = length(Number.MAX_SAFE_INTEGER)(data)

  t.equals(result, 5)

  t.end()
})
