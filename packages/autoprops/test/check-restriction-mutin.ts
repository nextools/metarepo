import test from 'blue-tape'
import BigInt from 'big-integer'
import { checkRestrictionMutin } from '../src/check-restriction-mutin'
import { getKeysWithState } from '../src/get-keys-with-state'

test('checkRestrictionMutin', (t) => {
  const mutin = [
    ['a', 'b'],
    ['b', 'c'],
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
    values.map((values) => checkRestrictionMutin(getKeysWithState(values, keys, 0), mutin)),
    [-1, 0, 0, 1, 1, 0, 0, -1],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutin: nothing to do', (t) => {
  const keys = ['a', 'b']
  const values = [
    [BigInt(0), BigInt(0), BigInt(0)],
    [BigInt(1), BigInt(0), BigInt(0)],
    [BigInt(0), BigInt(1), BigInt(0)],
    [BigInt(1), BigInt(1), BigInt(0)],
  ]

  t.deepEquals(
    values.map((values) => checkRestrictionMutin(getKeysWithState(values, keys, 0), [])),
    [-1, -1, -1, -1],
    'should return proper restriction'
  )

  t.end()
})
