import test from 'tape'
import { iterate } from '../src/iterate'
import { range } from '../src/range'

test('iterama: iterate', (t) => {
  const iterable = range(5)
  const iterator = iterate(iterable)

  t.deepEquals(
    [
      iterator.next().value,
      iterator.next().value,
    ],
    [0, 1],
    'should return iterator'
  )

  const result = [] as number[]

  for (const value of iterator) {
    result.push(value)
  }

  t.deepEquals(
    result,
    [2, 3, 4],
    'should return iterable iterator'
  )

  t.end()
})
