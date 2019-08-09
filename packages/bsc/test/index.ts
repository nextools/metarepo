import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import bsc from '../src'

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

test('found', (t) => {
  const comparator = createSpy(({ args: [key, mid] }) => key - mid)

  t.equal(
    bsc(arr, 2, comparator),
    2,
    'should return an index of matched item'
  )

  t.deepEqual(
    getSpyCalls(comparator),
    [[2, 4], [2, 1], [2, 2]],
    'should call comparator with necessary values'
  )

  t.end()
})

test('not found', (t) => {
  const comparator = createSpy(({ args: [key, mid] }) => key - mid)

  t.equal(
    bsc(arr, 10, comparator),
    -1,
    'should return -1'
  )

  t.deepEqual(
    getSpyCalls(comparator),
    [[10, 4], [10, 7], [10, 8], [10, 9]],
    'should call comparator with necessary values'
  )

  t.end()
})

test('empty array', (t) => {
  const comparator = createSpy(({ args: [key, mid] }) => key - mid)

  t.equal(
    bsc([], 0, comparator),
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
