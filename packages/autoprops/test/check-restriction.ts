import test from 'blue-tape'
import BigInt from 'big-integer'
import { checkRestriction, RESTRICTION_OK, RESTRICTION_MUTEX, RESTRICTION_MUTIN } from '../src/check-restriction'

test('checkRestriction: mutex', (t) => {
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
    values.map((values) => checkRestriction(values, 0, keys, mutex)),
    [
      RESTRICTION_OK,
      RESTRICTION_OK,
      RESTRICTION_OK,
      RESTRICTION_MUTEX,
      RESTRICTION_OK,
      RESTRICTION_MUTEX,
      RESTRICTION_OK,
      RESTRICTION_MUTEX,
    ],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestriction: mutin', (t) => {
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
    values.map((values) => checkRestriction(values, 0, keys, undefined, mutin)),
    [
      RESTRICTION_OK,
      RESTRICTION_MUTIN,
      RESTRICTION_MUTIN,
      RESTRICTION_MUTIN,
      RESTRICTION_MUTIN,
      RESTRICTION_MUTIN,
      RESTRICTION_MUTIN,
      RESTRICTION_OK,
    ],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestriction: nothing to do', (t) => {
  const keys = ['a', 'b']
  const values = [
    [BigInt(0), BigInt(0), BigInt(0)],
    [BigInt(1), BigInt(0), BigInt(0)],
    [BigInt(0), BigInt(1), BigInt(0)],
    [BigInt(1), BigInt(1), BigInt(0)],
  ]

  t.deepEquals(
    values.map((values) => checkRestriction(values, 0, keys)),
    [
      RESTRICTION_OK,
      RESTRICTION_OK,
      RESTRICTION_OK,
      RESTRICTION_OK,
    ],
    'should return proper restriction'
  )

  t.end()
})
