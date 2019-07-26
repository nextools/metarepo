import test from 'blue-tape'
import { arrayIntersect } from '../src/array-intersect'

test('ArrayIntersect: simple intersect', (t) => {
  const a0 = [1, 2, 3]
  const a1 = [2]

  const res = arrayIntersect(a0, a0.length, a1, a1.length)

  t.deepEquals(
    res,
    1,
    'should return number of intersect values'
  )

  t.end()
})

test('ArrayIntersect: intersect equal length arrays', (t) => {
  const a0 = [1, 2, 3]
  const a1 = [2, 3, 4]

  const res = arrayIntersect(a0, a0.length, a1, a1.length)

  t.deepEquals(
    res,
    2,
    'should return number of intersect values'
  )

  t.end()
})

test('ArrayIntersect: no intersection', (t) => {
  const a0 = [1, 2, 3]
  const a1 = [4, 5]

  const res = arrayIntersect(a0, a0.length, a1, a1.length)

  t.deepEquals(
    res,
    0,
    'no intersect values'
  )

  t.end()
})

test('ArrayIntersect: duplicate values', (t) => {
  const a0 = [1, 1, 1]
  const a1 = [1, 1]

  const res = arrayIntersect(a0, a0.length, a1, a1.length)

  t.deepEquals(
    res,
    2,
    'same values in arrays'
  )

  t.end()
})
