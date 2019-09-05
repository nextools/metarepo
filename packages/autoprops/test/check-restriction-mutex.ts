import test from 'blue-tape'
import BigInt from 'big-integer'
import { checkRestrictionMutex } from '../src/check-restriction-mutex'
import { getKeysWithStateProps } from '../src/get-keys-with-state'

test('checkRestrictionMutex', (t) => {
  const mutex = [
    ['a', 'b'],
    ['a', 'c'],
  ]
  const keys = ['a', 'b', 'c']
  const values = [
    [BigInt(0), BigInt(0), BigInt(0)],
    [BigInt(1), BigInt(0), BigInt(0)],
    [BigInt(0), BigInt(1), BigInt(0)],
    [BigInt(1), BigInt(1), BigInt(0)],
    [BigInt(0), BigInt(0), BigInt(1)],
    [BigInt(1), BigInt(0), BigInt(1)],
    [BigInt(0), BigInt(1), BigInt(1)],
    [BigInt(1), BigInt(1), BigInt(1)],
  ]

  t.deepEquals(
    values.map((values) => checkRestrictionMutex(getKeysWithStateProps(values, keys), mutex)),
    [-1, -1, -1, 0, -1, 1, -1, 0],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutex: nothing to do', (t) => {
  const keys = ['a', 'b']
  const values = [
    [BigInt(0), BigInt(0), BigInt(0)],
    [BigInt(1), BigInt(0), BigInt(0)],
    [BigInt(0), BigInt(1), BigInt(0)],
    [BigInt(1), BigInt(1), BigInt(0)],
  ]

  t.deepEquals(
    values.map((values) => checkRestrictionMutex(getKeysWithStateProps(values, keys), [])),
    [-1, -1, -1, -1],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutex: children', (t) => {
  const keys = ['a', 'b']
  const mutex = [
    ['a', 'children'],
    ['b', 'children'],
  ]
  const values = [
    [BigInt(0), BigInt(0), BigInt(1), BigInt(0)],
    [BigInt(1), BigInt(0), BigInt(1), BigInt(0)],
    [BigInt(0), BigInt(1), BigInt(0), BigInt(1)],
    [BigInt(1), BigInt(1), BigInt(0), BigInt(1)],
  ]

  t.deepEquals(
    values.map((values) => checkRestrictionMutex(getKeysWithStateProps(values, keys), mutex)),
    [-1, 0, 1, 0],
    'should return proper restriction'
  )

  t.end()
})
