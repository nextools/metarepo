import test from 'blue-tape'
import BigInt from 'big-integer'
import { checkAndEnableMutins, checkAndDisableMutins, checkAndDisableMutexes } from '../src/check-mutex'

test('checkAndEnableMutins', (t) => {
  const values = [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)]
  const expected = [BigInt(0), BigInt(0), BigInt(1), BigInt(1), BigInt(1), BigInt(0)]

  checkAndEnableMutins(
    values,
    2,
    ['a', 'b', 'c', 'd'],
    'c',
    [['a', 'b'], ['b', 'c'], ['c', 'd']],
    ['d']
  )

  t.true(
    values.every((val, i) => val.equals(expected[i])),
    'should properly modify values'
  )

  t.end()
})

test('checkAndDisableMutins', (t) => {
  const values = [BigInt(0), BigInt(0), BigInt(1), BigInt(1), BigInt(1)]
  const expected = [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)]

  checkAndDisableMutins(
    values,
    2,
    ['a', 'b', 'c'],
    'c',
    [['a', 'b'], ['b', 'c']]
  )

  t.true(
    values.every((val, i) => val.equals(expected[i])),
    'should properly modify values'
  )

  t.end()
})

test('checkAndDisableMutexes', (t) => {
  const values = [BigInt(0), BigInt(0), BigInt(1), BigInt(1), BigInt(1)]
  const expected = [BigInt(0), BigInt(0), BigInt(1), BigInt(0), BigInt(1)]

  checkAndDisableMutexes(
    values,
    2,
    ['a', 'b', 'c'],
    'c',
    [['a', 'b'], ['b', 'c', 'd']]
  )

  t.true(
    values.every((val, i) => val.equals(expected[i])),
    'should properly modify values'
  )

  t.end()
})
