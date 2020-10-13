import test from 'tape'
import { iterateAsync } from '../src/iterate-async'
import { rangeAsync } from '../src/range-async'

test('iterama: iterateAsync', async (t) => {
  const iterable = rangeAsync(5)
  const iterator = iterateAsync(iterable)

  t.deepEquals(
    [
      (await iterator.next()).value,
      (await iterator.next()).value,
    ],
    [0, 1],
    'should return async iterator'
  )

  const result = [] as number[]

  for await (const value of iterator) {
    result.push(value)
  }

  t.deepEquals(
    result,
    [2, 3, 4],
    'should return async iterable iterator'
  )
})
