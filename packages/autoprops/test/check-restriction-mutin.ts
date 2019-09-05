import test from 'blue-tape'
import I from 'big-integer'
import { checkRestrictionMutin } from '../src/check-restriction-mutin'
import { getKeysWithStateProps } from '../src/get-keys-with-state'

test('checkRestrictionMutin', (t) => {
  const mutin = [
    ['a', 'b'],
    ['b', 'c'],
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
    values.map((values) => checkRestrictionMutin(getKeysWithStateProps(values, keys), mutin)),
    [-1, 0, 0, 1, 1, 0, 0, -1],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutin: nothing to do', (t) => {
  const keys = ['a', 'b']
  const values = [
    [I(0), I(0), I(0)],
    [I(1), I(0), I(0)],
    [I(0), I(1), I(0)],
    [I(1), I(1), I(0)],
  ]

  t.deepEquals(
    values.map((values) => checkRestrictionMutin(getKeysWithStateProps(values, keys), [])),
    [-1, -1, -1, -1],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutin: children', (t) => {
  const keys = ['a', 'b']
  const mutin = [
    ['a', 'children'],
    ['b', 'children'],
  ]
  const values = [
    [I(0), I(0), I(0), I(0)],
    [I(1), I(0), I(0), I(0)],
    [I(1), I(0), I(0), I(1)],
    [I(0), I(1), I(0), I(0)],
    [I(1), I(1), I(0), I(0)],
    [I(1), I(1), I(0), I(1)],
  ]

  t.deepEquals(
    values.map((values) => checkRestrictionMutin(getKeysWithStateProps(values, keys), mutin)),
    [-1, 0, 1, 1, 0, -1],
    'should return proper restriction'
  )

  t.end()
})
