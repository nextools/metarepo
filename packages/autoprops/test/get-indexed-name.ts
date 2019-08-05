import test from 'blue-tape'
import { getIndexedName, getBaseName, getIndexedNameIndex, makeIndexedNames } from '../src'

test('getIndexedName', (t) => {
  const childIndexes = [0, 1, 2, 3, 4, 5]

  t.deepEquals(
    childIndexes.map((index) => getIndexedName(['a', 'child', 'a', 'child', 'b', 'b'], index)),
    ['a__0', 'child__0', 'a__1', 'child__1', 'b__0', 'b__1'],
    'should return proper names'
  )

  t.end()
})

test('getBaseName', (t) => {
  const names = ['a__0', 'child__0', 'a__1', 'child__1', 'b__0', 'b__1']

  t.deepEquals(
    names.map(getBaseName),
    ['a', 'child', 'a', 'child', 'b', 'b'],
    'should return proper names'
  )

  t.end()
})

test('getIndexedNameIndex', (t) => {
  const names = ['a', 'child', 'a', 'child', 'b', 'b']
  const indexedNames = ['a__0', 'child__0', 'a__1', 'child__1', 'b__0', 'b__1']

  t.deepEquals(
    indexedNames.map((name) => getIndexedNameIndex(names, name)),
    [0, 1, 2, 3, 4, 5],
    'should return proper indexes'
  )

  t.throws(
    () => getIndexedNameIndex(names, 'invalid')
  )

  t.end()
})

test('makeIndexedNames', (t) => {
  const names = ['a', 'child', 'a', 'child', 'b', 'b']

  t.deepEquals(
    makeIndexedNames(names),
    ['a__0', 'child__0', 'a__1', 'child__1', 'b__0', 'b__1'],
    'should return proper names'
  )

  t.end()
})
