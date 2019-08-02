import test from 'blue-tape'
import { checkAndEnableMutins, checkAndDisableMutins, checkAndDisableMutexes } from '../src/check-mutex'

test('checkAndEnableMutins', (t) => {
  const values = [0n, 0n, 0n, 0n, 0n]
  checkAndEnableMutins(
    values,
    2,
    ['a', 'b', 'c'],
    'c',
    [['a', 'b'], ['b', 'c']],
    undefined
  )

  t.deepEquals(
    values,
    [0n, 0n, 1n, 1n, 1n],
    'should properly modify values'
  )

  t.end()
})

test('checkAndDisableMutins', (t) => {
  const values = [0n, 0n, 1n, 1n, 1n]
  checkAndDisableMutins(
    values,
    2,
    ['a', 'b', 'c'],
    'c',
    [['a', 'b'], ['b', 'c']]
  )

  t.deepEquals(
    values,
    [0n, 0n, 0n, 0n, 0n],
    'should properly modify values'
  )

  t.end()
})

test('checkAndDisableMutexes', (t) => {
  const values = [0n, 0n, 1n, 1n, 1n]
  checkAndDisableMutexes(
    values,
    2,
    ['a', 'b', 'c'],
    'c',
    [['a', 'b'], ['b', 'c']]
  )

  t.deepEquals(
    values,
    [0n, 0n, 1n, 0n, 1n],
    'should properly modify values'
  )

  t.end()
})
