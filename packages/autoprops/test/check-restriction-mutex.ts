import test from 'blue-tape'
import I from 'big-integer'
import { checkRestrictionMutex } from '../src/check-restriction-mutex'

test('checkRestrictionMutex', (t) => {
  const mutex = [
    ['a', 'b'],
    ['a', 'c'],
  ]
  const keys = ['a', 'b', 'c']
  const values = [
    [I(0), I(0), I(0)],
    [I(1), I(0), I(0)],
    [I(0), I(1), I(0)],
    [I(1), I(1), I(0)],
    [I(0), I(0), I(1)],
    [I(1), I(0), I(1)],
    [I(0), I(1), I(1)],
    [I(1), I(1), I(1)],
  ]

  t.deepEquals(
    values.map((values) => checkRestrictionMutex(values, 0, keys, mutex)),
    [-1, -1, -1, 0, -1, 1, -1, 0],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutex: children', (t) => {
  const mutex = [
    ['a', 'b'],
  ]
  const keys = ['a', 'b']
  const values = [
    [I(0), I(0), I(0)],
    [I(1), I(0), I(0)],
    [I(0), I(1), I(0)],
    [I(1), I(1), I(0)],
    [I(0), I(0), I(1)],
    [I(1), I(0), I(1)],
    [I(0), I(1), I(1)],
    [I(1), I(1), I(1)],
  ]

  t.deepEquals(
    values.map((values) => checkRestrictionMutex(values, 1, keys, mutex)),
    [-1, -1, -1, -1, -1, -1, 0, 0],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutex: nothing to do', (t) => {
  const keys = ['a', 'b']
  const values = [
    [I(0), I(0), I(0)],
    [I(1), I(0), I(0)],
    [I(0), I(1), I(0)],
    [I(1), I(1), I(0)],
  ]

  t.deepEquals(
    values.map((values) => checkRestrictionMutex(values, 0, keys, [])),
    [-1, -1, -1, -1],
    'should return proper restriction'
  )

  t.end()
})
