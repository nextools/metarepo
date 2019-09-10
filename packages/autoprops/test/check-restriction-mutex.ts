import test from 'blue-tape'
import I from 'big-integer'
import { checkRestrictionMutex, checkRestrictionMutexPropsChildren } from '../src/check-restriction-mutex'

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
    [false, false, false, true, false, true, false, true],
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
    [false, false, false, false, false, false, true, true],
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
    [false, false, false, false],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutexPropsChildren', (t) => {
  const mutex = [
    ['a', 'b'],
    ['child', 'a'],
  ]
  const keys = ['a', 'b']
  const childrenKeys = ['child']
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
    values.map((values) => checkRestrictionMutexPropsChildren(values, keys, childrenKeys, mutex)),
    [false, false, false, true, false, true, false, true],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutexPropsChildren: children', (t) => {
  const mutex = [
    ['a', 'child'],
  ]
  const keys = ['a', 'b']
  const childrenKeys = ['child']
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
    values.map((values) => checkRestrictionMutexPropsChildren(values, keys, childrenKeys, mutex)),
    [false, false, false, false, false, true, false, true],
    'should return proper restriction'
  )

  t.end()
})

test('checkRestrictionMutexPropsChildren: nothing to do', (t) => {
  const keys = ['a', 'b']
  const childrenKeys = ['child']
  const values = [
    [I(0), I(0), I(0)],
    [I(1), I(0), I(0)],
    [I(0), I(1), I(0)],
    [I(1), I(1), I(0)],
  ]

  t.deepEquals(
    values.map((values) => checkRestrictionMutexPropsChildren(values, keys, childrenKeys, [])),
    [false, false, false, false],
    'should return proper restriction'
  )

  t.end()
})
