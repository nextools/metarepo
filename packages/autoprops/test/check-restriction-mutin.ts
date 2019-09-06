import test from 'blue-tape'
import I from 'big-integer'
import { checkRestrictionMutin } from '../src/check-restriction-mutin'

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
    values.map((values) => checkRestrictionMutin(values, 0, keys, mutin)),
    [-1, 0, 0, 1, 1, 0, 0, -1],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutin: children', (t) => {
  const mutin = [
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
    values.map((values) => checkRestrictionMutin(values, 1, keys, mutin)),
    [-1, -1, 0, 0, 0, 0, -1, -1],
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
    values.map((values) => checkRestrictionMutin(values, 0, keys, [])),
    [-1, -1, -1, -1],
    'should return proper restriction'
  )

  t.end()
})
