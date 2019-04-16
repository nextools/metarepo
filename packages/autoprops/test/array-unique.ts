import test from 'blue-tape'
import { arrayUnique } from '../src/array-unique'

test('Array unique: empty array', (t) => {
  t.equals(
    arrayUnique([]),
    true,
    'should be unique when empty'
  )

  t.end()
})

test('Array unique: one value', (t) => {
  t.equals(
    arrayUnique([1]),
    true,
    'should be unique with one value'
  )

  t.end()
})

test('Array unique: unique values', (t) => {
  t.equals(
    arrayUnique([0, 1, 2, 3, 4, 5, 6]),
    true,
    'should be unique with all unique values'
  )

  t.end()
})

test('Array unique: repeating values in the beginning', (t) => {
  t.equals(
    arrayUnique([0, 0, 2, 3, 4, 5, 6]),
    false,
    'should not be unique with same values in the beginning'
  )

  t.end()
})

test('Array unique: same values in the beginning and in the end', (t) => {
  t.equals(
    arrayUnique([0, 1, 2, 3, 4, 5, 0]),
    false,
    'should not be unique'
  )

  t.end()
})

test('Array unique: same values in the end', (t) => {
  t.equals(
    arrayUnique([0, 1, 2, 3, 4, 5, 5]),
    false,
    'should not be unique with the same values in the end'
  )

  t.end()
})

test('Array unique: all values the same', (t) => {
  t.equals(
    arrayUnique([2, 2, 2, 2]),
    false,
    'should not be unique with all values the same'
  )

  t.end()
})
