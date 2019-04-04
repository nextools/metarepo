import test from 'blue-tape'
import { getPermutations } from '../src/get-permutations'
import { getKeys } from '../src/get-keys'
import { MutexGroup, PropsWithValues } from '../src/types'

test('Get Permutations: simple boolean mutual exclusion', async (t) => {
  type Props = {
    a?: boolean
    b?: boolean
  }
  const props: PropsWithValues<Props> = {
    a: [undefined, true],
    b: [undefined, true],
  }
  const mutex: MutexGroup<Props>[] = [
    ['a', 'b'],
  ]
  const keys = getKeys(props)
  const res = getPermutations(props, keys, mutex)

  /* values */
  t.deepEquals(
    res,
    [
      [0, 0],
      [1, 0],
      [0, 1],
    ]
  )
})

// This test is disabled due to change of the mutex group logic
test.skip('Get Permutations: boolean single possible state', async (t) => {
  type Props = {
    a: boolean
    b?: boolean
  }
  const props: PropsWithValues<Props> = {
    a: [true],
    b: [true, undefined],
  }
  const mutex: MutexGroup<Props>[] = [
    ['a', 'b'],
  ]
  const keys = getKeys(props)
  const res = getPermutations(props, keys, mutex)

  /* values */
  t.deepEquals(
    res,
    [
      [0, 1],
    ]
  )
})

// This test is disabled due to change of the mutex group logic
test.skip('Get Permutations: boolean total exclusion', async (t) => {
  type Props = {
    a: boolean
    b: boolean
  }
  const props: PropsWithValues<Props> = {
    a: [true],
    b: [true],
  }
  const mutex: MutexGroup<Props>[] = [
    ['a', 'b'],
  ]
  const keys = getKeys(props)
  const res = getPermutations(props, keys, mutex)

  // values
  t.deepEquals(
    res,
    []
  )
})

test('Get Permutations: booleans 2 independent groups', async (t) => {
  type Props = {
    a?: boolean
    b?: boolean
    c?: boolean
    d?: boolean
  }
  const props: PropsWithValues<Props> = {
    a: [undefined, true],
    b: [undefined, true],
    c: [undefined, true],
    d: [undefined, true],
  }
  const mutex: MutexGroup<Props>[] = [
    ['a', 'b'],
    ['c', 'd'],
  ]
  const keys = getKeys(props)
  const res = getPermutations(props, keys, mutex)

  /* values */
  t.deepEquals(
    res,
    [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [1, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 1],
      [1, 0, 0, 1],
      [0, 1, 0, 1],
    ]
  )
})

test('Get Permutations: multiple props with different length', async (t) => {
  type Props = {
    a: boolean
    b: string
    c: number
  }
  const props: PropsWithValues<Props> = {
    a: [false, true],
    b: [''],
    c: [1, 2, 3, 4],
  }
  const keys = getKeys(props)
  const res = getPermutations(props, keys)

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
    ]
  )
})

test('Get Permutations: complex case', async (t) => {
  type Props = {
    success?: boolean
    warning?: boolean
    error?: boolean

    title: string
    content?: string[]
    minimal?: boolean
  }
  const props: PropsWithValues<Props> = {
    success: [undefined, true],
    warning: [undefined, true],
    error: [undefined, true],

    title: ['Title', 'Longer title'],
    content: [
      undefined,
      ['Line0'],
      ['Line0', 'Line1'],
    ],
    minimal: [undefined, true],
  }
  const mutex: MutexGroup<Props>[] = [
    ['success', 'warning', 'error'],
    ['minimal', 'content'],
  ]
  const keys = getKeys(props)
  const res = getPermutations(props, keys, mutex)

  /* values */
  t.deepEquals(
    res,
    [
      [0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [1, 0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 1, 0],
      [0, 0, 1, 0, 1, 0],
      [0, 0, 0, 1, 1, 0],
      [1, 0, 0, 1, 1, 0],
      [0, 1, 0, 1, 1, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 2, 0],
      [1, 0, 0, 0, 2, 0],
      [0, 1, 0, 0, 2, 0],
      [0, 0, 1, 0, 2, 0],
      [0, 0, 0, 1, 2, 0],
      [1, 0, 0, 1, 2, 0],
      [0, 1, 0, 1, 2, 0],
      [0, 0, 1, 1, 2, 0],
      [0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 1],
      [0, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1],
      [0, 1, 0, 1, 0, 1],
      [0, 0, 1, 1, 0, 1],
    ]
  )
})

test('Get Permutations: exclude all but first', async (t) => {
  type Props = {
    a?: boolean
    b?: boolean,
    c: string
  }
  const props: PropsWithValues<Props> = {
    a: [undefined, true],
    b: [undefined, true],
    c: ['short', 'long', 'another'],
  }
  const mutex: MutexGroup<Props>[] = [
    ['a', 'b', 'c'],
  ]
  const keys = getKeys(props)
  const res = getPermutations(props, keys, mutex)

  // values
  t.deepEquals(
    res,
    [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 2],
    ]
  )
})

test('Get Permutations: consider \'undefined\' as valid exclusion', async (t) => {
  type Props = {
    a?: boolean
    b: string
  }
  const props: PropsWithValues<Props> = {
    a: [false, undefined, true],
    b: ['short', 'long', 'another'],
  }
  const mutex: MutexGroup<Props>[] = [
    ['a', 'b'],
  ]
  const keys = getKeys(props)
  const res = getPermutations(props, keys, mutex)

  // values
  t.deepEquals(
    res,
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [0, 2],
      [1, 2],
    ]
  )
})
