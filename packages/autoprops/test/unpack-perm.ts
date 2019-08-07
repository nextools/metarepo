import test from 'blue-tape'
import BigInt from 'big-integer'
import { TMetaFile, Permutation } from '../src/types'
import { unpackPerm } from '../src/unpack-perm'

const permEquals = (a: Permutation, b: Permutation): boolean => {
  if (a.values.length !== b.values.length) {
    return false
  }

  for (let i = 0; i < a.values.length; ++i) {
    if (a.values[i].notEquals(b.values[i])) {
      return false
    }
    if (a.length[i].notEquals(b.length[i])) {
      return false
    }
  }

  return true
}

test('decimalToPerm: props', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
      },
    },
    Component: () => null,
  }

  const packed = [BigInt(0), BigInt(1), BigInt(2), BigInt(3)]
  const expected = [
    {
      values: [BigInt(0), BigInt(0)],
      length: [BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(0)],
      length: [BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(1)],
      length: [BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(1)],
      length: [BigInt(2), BigInt(2)],
    },
  ]

  t.true(
    packed
      .map((value) => unpackPerm(value, meta))
      .every((perm, i) => permEquals(perm, expected[i])),
    'should return proper perms'
  )

  t.end()
})

test('decimalToPerm: props with children', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
      },
    },
    childrenConfig: {
      meta: {
        child: {
          config: {
            props: {
              a: [true],
            },
          },
          Component: () => null,
        },
        child2: {
          config: {
            props: {},
          },
          Component: () => null,
        },
      },
      children: ['child', 'child', 'child2'],
      required: ['child'],
    },
    Component: () => null,
  }

  const decimals = [BigInt(0), BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5), BigInt(6), BigInt(7), BigInt(8), BigInt(9), BigInt(10), BigInt(11), BigInt(12), BigInt(13), BigInt(14), BigInt(15), BigInt(16), BigInt(17), BigInt(18), BigInt(19), BigInt(20), BigInt(21), BigInt(22), BigInt(23), BigInt(24), BigInt(25), BigInt(26), BigInt(27), BigInt(28), BigInt(29), BigInt(30), BigInt(31)]
  const expected = [
    {
      values: [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(0), BigInt(0), BigInt(0), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(1), BigInt(0), BigInt(0), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(1), BigInt(0), BigInt(0), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(0), BigInt(1), BigInt(0), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(0), BigInt(1), BigInt(0), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(1), BigInt(1), BigInt(0), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(1), BigInt(1), BigInt(0), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(0), BigInt(0), BigInt(1), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(0), BigInt(0), BigInt(1), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(1), BigInt(0), BigInt(1), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(1), BigInt(0), BigInt(1), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(0), BigInt(1), BigInt(1), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(0), BigInt(1), BigInt(1), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(1), BigInt(1), BigInt(1), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(1), BigInt(1), BigInt(1), BigInt(0)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(0), BigInt(0), BigInt(0), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(1), BigInt(0), BigInt(0), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(1), BigInt(0), BigInt(0), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(0), BigInt(1), BigInt(0), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(0), BigInt(1), BigInt(0), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(1), BigInt(1), BigInt(0), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(1), BigInt(1), BigInt(0), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(0), BigInt(0), BigInt(1), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(0), BigInt(0), BigInt(1), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(1), BigInt(0), BigInt(1), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(1), BigInt(0), BigInt(1), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(0), BigInt(1), BigInt(1), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(0), BigInt(1), BigInt(1), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(0), BigInt(1), BigInt(1), BigInt(1), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
    {
      values: [BigInt(1), BigInt(1), BigInt(1), BigInt(1), BigInt(1)],
      length: [BigInt(2), BigInt(2), BigInt(2), BigInt(2), BigInt(2)],
    },
  ]

  t.true(
    decimals
      .map((value) => unpackPerm(value, meta))
      .every((perm, i) => permEquals(perm, expected[i])),
    'should return proper perms'
  )

  t.end()
})
