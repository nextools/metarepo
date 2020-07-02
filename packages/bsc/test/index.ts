import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import bsc from '../src'

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

test('found', (t) => {
  const key = 2
  const comparator = createSpy(({ args: [mid] }) => key - mid)

  t.equal(
    bsc(arr, comparator),
    2,
    'should return an index of matched item'
  )

  t.deepEqual(
    getSpyCalls(comparator),
    [[4], [1], [2]],
    'should call comparator with necessary values'
  )

  t.end()
})

test('not found', (t) => {
  const key = 10
  const comparator = createSpy(({ args: [mid] }) => key - mid)

  t.equal(
    bsc(arr, comparator),
    -1,
    'should return -1'
  )

  t.deepEqual(
    getSpyCalls(comparator),
    [[4], [7], [8], [9]],
    'should call comparator with necessary values'
  )

  t.end()
})

test('empty array', (t) => {
  const key = 0
  const comparator = createSpy(({ args: [mid] }) => key - mid)

  t.equal(
    bsc([], comparator),
    -1,
    'should return -1'
  )

  t.deepEqual(
    getSpyCalls(comparator),
    [],
    'should not call comparator'
  )

  t.end()
})
