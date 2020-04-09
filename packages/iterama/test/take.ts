import test from 'tape'
import { pipe } from '@psxcode/compose'
import { take } from '../src/take'
import { range } from '../src/range'
import { toArray } from '../src/to-array'

test('iterama: take + positive number', (t) => {
  const iterable = range(5)
  const result = pipe(
    take(3),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2],
    'should take N first elements'
  )

  t.end()
})

test('iterama: take + negative number', (t) => {
  const iterable = range(5)
  const result = pipe(
    take(-3),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [2, 3, 4],
    'should take N last elements'
  )

  t.end()
})

test('iterama: take + more than needed', (t) => {
  const iterable = range(5)
  const result = pipe(
    take(42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should take all elements'
  )

  t.end()
})

test('iterama: take + negative more than needed', (t) => {
  const iterable = range(5)
  const result = pipe(
    take(-42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should take all elements'
  )

  t.end()
})
