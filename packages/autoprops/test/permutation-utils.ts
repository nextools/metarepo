import test from 'blue-tape'
import { Permutation } from '../src/types'
import {
  bumpPermutation,
  getInitialPermutation,
  getLengthPermutation,
  getMaxPermutation,
  getTotalPermutations,
} from '../src/permutation-utils'
import { getKeys } from '../src/get-keys'

test('Initial Permutation', (t) => {
  const props = {
    a: [true],
    b: [true],
    c: [true],
    d: [true],
  }
  const keys = getKeys(props)
  const lengthPerm = getLengthPermutation(props, keys)
  const initialPerm = getInitialPermutation(lengthPerm)

  t.deepEquals(
    initialPerm,
    [0, 0, 0, 0],
    'should return initial permutation'
  )

  t.end()
})

test('Permutation Length: simple case', (t) => {
  const props = {
    a: [1, 2, 3],
  }
  const keys = getKeys(props)
  const lengthPerm = getLengthPermutation(props, keys)

  t.deepEquals(
    lengthPerm,
    [3],
    'should return permutation length'
  )

  t.end()
})

test('Permutation Length: multiple props with different length', (t) => {
  const props = {
    a: [1, 2, 3],
    b: [true, false],
    c: [''],
  }
  const keys = getKeys(props)
  const lengthPerm = getLengthPermutation(props, keys)

  t.deepEquals(
    lengthPerm,
    [3, 2, 1],
    'should return permutation lengths'
  )

  t.end()
})

test('Max Permutation: simple case', (t) => {
  const props = {
    a: [1, 2, 3],
  }
  const keys = getKeys(props)
  const lengthPerm = getLengthPermutation(props, keys)
  const maxPerm = getMaxPermutation(lengthPerm)

  t.deepEquals(
    maxPerm,
    [2],
    'should return max permutation value'
  )

  t.end()
})

test('Max Permutation: multiple props with different length', (t) => {
  const props = {
    a: [1, 2, 3],
    b: [true, false],
    c: [''],
  }
  const keys = getKeys(props)
  const lengthPerm = getLengthPermutation(props, keys)
  const maxPerm = getMaxPermutation(lengthPerm)

  t.deepEquals(
    maxPerm,
    [2, 1, 0],
    'should return max permutation values'
  )

  t.end()
})

test('Total Permutations: simple case', (t) => {
  const props = {
    a: [true, false],
  }
  const keys = getKeys(props)
  const lengthPerm = getLengthPermutation(props, keys)
  const totalPerms = getTotalPermutations(lengthPerm)

  t.equals(
    totalPerms,
    2
  )

  t.end()
})

test('Total Permutations: complex case', (t) => {
  const props = {
    a: [true, false],
    b: ['', '', ''],
    c: [null],
    d: [32, 64],
  }
  const keys = getKeys(props)
  const lengthPerm = getLengthPermutation(props, keys)
  const totalPerms = getTotalPermutations(lengthPerm)

  t.equals(
    totalPerms,
    12,
    'should return total permutations value'
  )

  t.end()
})

test('Permutations: single prop', (t) => {
  type Props = {
    a: string,
  }
  const props = {
    a: ['', 'true', 'false'],
  }
  const keys = getKeys(props)
  const lengthPerm = getLengthPermutation<Props>(props, keys)
  const bump = bumpPermutation(lengthPerm)
  const total = getTotalPermutations(lengthPerm)
  const res = [] as Permutation<Props>[]

  const currentPerm = getInitialPermutation(lengthPerm)
  res.push(currentPerm.slice() as Permutation<Props>)

  for (let i = 1; i < total; ++i) {
    bump(currentPerm)
    res.push(currentPerm.slice() as Permutation<Props>)
  }

  t.deepEquals(
    res,
    [
      [0],
      [1],
      [2],
    ],
    'should return all permutations'
  )

  t.end()
})

test('Permutations: two booleans', (t) => {
  type Props = {
    a?: boolean,
    b?: boolean,
  }
  const props = {
    a: [undefined, true],
    b: [undefined, true],
  }
  const keys = getKeys<Props>(props)
  const lengthPerm = getLengthPermutation<Props>(props, keys)
  const bump = bumpPermutation(lengthPerm)
  const total = getTotalPermutations(lengthPerm)
  const res = [] as Permutation<Props>[]

  const currentPerm = getInitialPermutation(lengthPerm)
  res.push(currentPerm.slice() as Permutation<Props>)

  for (let i = 1; i < total; ++i) {
    bump(currentPerm)
    res.push(currentPerm.slice() as Permutation<Props>)
  }

  t.deepEquals(
    res,
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    'should return all permutations'
  )

  t.end()
})

test('Permutations: multiple props with different length', (t) => {
  type Props = {
    a: boolean,
    b: string,
    c: number,
  }
  const props = {
    a: [false, true],
    b: [''],
    c: [1, 2, 3, 4],
  }
  const keys = getKeys(props)
  const lengthPerm = getLengthPermutation<Props>(props, keys)
  const total = getTotalPermutations(lengthPerm)
  const bump = bumpPermutation(lengthPerm)
  const res = [] as Permutation<Props>[]

  const currentPerm = getInitialPermutation(lengthPerm)
  res.push(currentPerm.slice() as Permutation<Props>)

  for (let i = 1; i < total; ++i) {
    bump(currentPerm)
    res.push(currentPerm.slice() as Permutation<Props>)
  }

  t.deepEquals(
    res,
    [
      [0, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
      [1, 0, 1],
      [0, 0, 2],
      [1, 0, 2],
      [0, 0, 3],
      [1, 0, 3],
    ],
    'should return all permutations'
  )

  t.end()
})

test('Permutations: should throw on permutation overflow', (t) => {
  const props = {
    a: [false, true],
  }
  const keys = getKeys(props)
  const lengthPerm = getLengthPermutation(props, keys)
  const bump = bumpPermutation(lengthPerm)

  /* [0] */
  const currentPerm = getInitialPermutation(lengthPerm)

  /* [1] */
  bump(currentPerm)

  /* no more bumps available */
  t.throws(
    bump.bind(null, currentPerm),
    'should throw when no more bumps available'
  )

  t.end()
})
