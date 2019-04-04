import test from 'blue-tape'
import { arrayUnique } from '../src/array-unique'

test('Array unique: empty array', async (t) => {
  t.equals(
    arrayUnique([]),
    true,
    'should be unique when empty'
  )
})

test('Array unique: one value', async (t) => {
  t.equals(
    arrayUnique([1]),
    true,
    'should be unique with one value'
  )
})

test('Array unique: unique values', async (t) => {
  t.equals(
    arrayUnique([0, 1, 2, 3, 4, 5, 6]),
    true,
    'should be unique with all unique values'
  )
})

test('Array unique: repeating values in the beginning', async (t) => {
  t.equals(
    arrayUnique([0, 0, 2, 3, 4, 5, 6]),
    false,
    'should not be unique with same values in the beginning'
  )
})

test('Array unique: same values in the beginning and in the end', async (t) => {
  t.equals(
    arrayUnique([0, 1, 2, 3, 4, 5, 0]),
    false,
    'should not be unique'
  )
})

test('Array unique: same values in the end', async (t) => {
  t.equals(
    arrayUnique([0, 1, 2, 3, 4, 5, 5]),
    false,
    'should not be unique with the same values in the end'
  )
})

test('Array unique: all values the same', async (t) => {
  t.equals(
    arrayUnique([2, 2, 2, 2]),
    false,
    'should not be unique with all values the same'
  )
})
