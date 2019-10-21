import test from 'blue-tape'
import I from 'big-integer'
import { checkRestrictionMutex } from '../src/check-restriction-mutex'

test('checkRestrictionMutex', (t) => {
  const mutex = [
    ['a', 'b'],
    ['a', 'c'],
  ]
  const keys = ['a', 'b']
  const childrenKeys = ['c']
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
    values.map((values) => checkRestrictionMutex(values, keys, childrenKeys, mutex)),
    [false, false, false, true, false, true, false, true],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutex: nothing to do', (t) => {
  const keys = ['a', 'b']
  const childrenKeys = ['c']
  const values = [
    [I(0), I(0), I(0)],
    [I(1), I(0), I(0)],
    [I(0), I(1), I(0)],
    [I(1), I(1), I(0)],
  ]

  t.deepEquals(
    values.map((values) => checkRestrictionMutex(values, keys, childrenKeys, [])),
    [false, false, false, false],
    'should return proper restriction'
  )

  t.end()
})
