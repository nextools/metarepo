import test from 'blue-tape'
import I from 'big-integer'
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

  const packed = [I(0), I(1), I(2), I(3)]
  const expected = [
    {
      values: [I(0), I(0)],
      length: [I(2), I(2)],
    },
    {
      values: [I(1), I(0)],
      length: [I(2), I(2)],
    },
    {
      values: [I(0), I(1)],
      length: [I(2), I(2)],
    },
    {
      values: [I(1), I(1)],
      length: [I(2), I(2)],
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

  const decimals = [I(0), I(1), I(2), I(3), I(4), I(5), I(6), I(7), I(8), I(9), I(10), I(11), I(12), I(13), I(14), I(15), I(16), I(17), I(18), I(19), I(20), I(21), I(22), I(23), I(24), I(25), I(26), I(27), I(28), I(29), I(30), I(31)]
  const expected = [
    {
      values: [I(0), I(0), I(0), I(0), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(0), I(0), I(0), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(1), I(0), I(0), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(1), I(0), I(0), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(0), I(1), I(0), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(0), I(1), I(0), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(1), I(1), I(0), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(1), I(1), I(0), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(0), I(0), I(1), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(0), I(0), I(1), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(1), I(0), I(1), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(1), I(0), I(1), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(0), I(1), I(1), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(0), I(1), I(1), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(1), I(1), I(1), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(1), I(1), I(1), I(0)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(0), I(0), I(0), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(0), I(0), I(0), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(1), I(0), I(0), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(1), I(0), I(0), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(0), I(1), I(0), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(0), I(1), I(0), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(1), I(1), I(0), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(1), I(1), I(0), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(0), I(0), I(1), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(0), I(0), I(1), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(1), I(0), I(1), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(1), I(0), I(1), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(0), I(1), I(1), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(0), I(1), I(1), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(0), I(1), I(1), I(1), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
    },
    {
      values: [I(1), I(1), I(1), I(1), I(1)],
      length: [I(2), I(2), I(2), I(2), I(2)],
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
