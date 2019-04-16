import test from 'blue-tape'
import { arrayIntersect } from '../src/array-intersect'

test('ArrayIntersect: simple intersect', (t) => {
  const a0 = [1, 2, 3]
  const a1 = [2]

  const res = arrayIntersect(a0, a1)

  t.deepEquals(
    res,
    [2],
    'should return intersect values'
  )

  t.end()
})

test('ArrayIntersect: intersect equal length arrays', (t) => {
  const a0 = [1, 2, 3]
  const a1 = [2, 3, 4]

  const res = arrayIntersect(a0, a1)

  t.deepEquals(
    res,
    [2, 3],
    'should return intersect values'
  )

  t.end()
})

test('ArrayIntersect: no intersection', (t) => {
  const a0 = [1, 2, 3]
  const a1 = [4, 5]

  const res = arrayIntersect(a0, a1)

  t.deepEquals(
    res,
    [],
    'no intersect values'
  )

  t.end()
})

test('ArrayIntersect: duplicate values', (t) => {
  const a0 = [1, 1, 1]
  const a1 = [1, 1]

  const res = arrayIntersect(a0, a1)

  t.deepEquals(
    res,
    [1, 1],
    'same values in arrays'
  )

  t.end()
})
