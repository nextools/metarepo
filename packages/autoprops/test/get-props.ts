import test from 'blue-tape'
import { getProps } from '../src/get-props'
import { getKeys } from '../src/get-keys'
import { getPermutations } from '../src/get-permutations'

test('Get Props: boolean triple state', (t) => {
  type Props = {
    a?: boolean,
  }
  const props = {
    a: [undefined, true, false],
  }
  const keys = getKeys<Props>(props)
  const perms = getPermutations(props, keys)
  const res = getProps<Props>(props, keys, perms)

  /* values */
  t.deepEquals(
    res,
    [
      {},
      {
        a: true,
      },
      {
        a: false,
      },
    ]
  )

  t.end()
})

test('Get Props: boolean states', (t) => {
  type Props = {
    a?: boolean,
    b?: boolean,
  }
  const props = {
    a: [undefined, true],
    b: [undefined, true],
  }
  const keys = getKeys<Props>(props)
  const perms = getPermutations(props, keys)
  const res = getProps<Props>(props, keys, perms)

  /* values */
  t.deepEquals(
    res,
    [
      {},
      {
        a: true,
      },
      {
        b: true,
      },
      {
        a: true,
        b: true,
      },
    ]
  )

  t.end()
})

test('Get Props: multiple boolean states', (t) => {
  type Props = {
    a?: boolean,
    b?: boolean,
    c?: boolean,
  }
  const props = {
    a: [undefined, true],
    b: [undefined, true],
    c: [undefined, true],
  }
  const keys = getKeys<Props>(props)
  const perms = getPermutations(props, keys)
  const res = getProps<Props>(props, keys, perms)

  /* values */
  t.deepEquals(
    res,
    [
      {},
      {
        a: true,
      },
      {
        b: true,
      },
      {
        a: true,
        b: true,
      },
      {
        c: true,
      },
      {
        a: true,
        c: true,
      },
      {
        b: true,
        c: true,
      },
      {
        a: true,
        b: true,
        c: true,
      },
    ]
  )

  t.end()
})

test('Get Props: should work with 10 values', (t) => {
  const props = {
    a: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  }
  const keys = getKeys(props)
  const perms = getPermutations(props, keys)

  t.deepEquals(
    getProps(props, keys, perms).length,
    10
  )

  t.end()
})

test('Get Props: should work with more than 10 values', (t) => {
  const props = {
    a: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  }
  const keys = getKeys(props)
  const perms = getPermutations(props, keys)

  t.deepEquals(
    getProps(props, keys, perms).length,
    12
  )

  t.end()
})
