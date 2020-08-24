import I from 'big-integer'
import test from 'tape'
import type { TCommonComponentConfig, TPermutation } from '../src/types'
import { unpackPerm } from '../src/unpack-perm'

test('autoprops: unpackPerm props', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
  }

  const packed = [I(0), I(1), I(2), I(3), I(4)]
  const expected: TPermutation[] = [
    {
      values: [I(0), I(0)],
      lengths: [I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: [],
    },
    {
      values: [I(1), I(0)],
      lengths: [I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: [],
    },
    {
      values: [I(0), I(1)],
      lengths: [I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: [],
    },
    {
      values: [I(1), I(1)],
      lengths: [I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: [],
    },
    // overflow value
    {
      values: [I(0), I(0)],
      lengths: [I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: [],
    },
  ]

  t.deepEquals(
    packed.map((value) => unpackPerm(config, value)),
    expected,
    'should return proper perms'
  )

  t.end()
})

test('autoprops: unpackPerm props with children', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      child0: {
        config: {
          props: {
            a: [true],
          },
        },
        Component: () => null,
      },
      child1: {
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
    required: ['child0', 'child1'],
  }

  const decimals = [I(0), I(1), I(2), I(3), I(4), I(5), I(6), I(7), I(8), I(9), I(10), I(11), I(12), I(13), I(14), I(15), I(16), I(17), I(18), I(19), I(20), I(21), I(22), I(23), I(24), I(25), I(26), I(27), I(28), I(29), I(30), I(31)]
  const expected: TPermutation[] = [
    {
      values: [I(0), I(0), I(0), I(0), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(0), I(0), I(0), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(1), I(0), I(0), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(1), I(0), I(0), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(0), I(1), I(0), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(0), I(1), I(0), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(1), I(1), I(0), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(1), I(1), I(0), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(0), I(0), I(1), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(0), I(0), I(1), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(1), I(0), I(1), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(1), I(0), I(1), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(0), I(1), I(1), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(0), I(1), I(1), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(1), I(1), I(1), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(1), I(1), I(1), I(0)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(0), I(0), I(0), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(0), I(0), I(0), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(1), I(0), I(0), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(1), I(0), I(0), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(0), I(1), I(0), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(0), I(1), I(0), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(1), I(1), I(0), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(1), I(1), I(0), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(0), I(0), I(1), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(0), I(0), I(1), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(1), I(0), I(1), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(1), I(0), I(1), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(0), I(1), I(1), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(0), I(1), I(1), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(0), I(1), I(1), I(1), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
    {
      values: [I(1), I(1), I(1), I(1), I(1)],
      lengths: [I(2), I(2), I(2), I(2), I(2)],
      propKeys: ['a', 'b'],
      childrenKeys: ['child0', 'child1', 'child2'],
    },
  ]

  t.deepEquals(
    decimals.map((value) => unpackPerm(config, value)),
    expected,
    'should return proper perms'
  )

  t.end()
})

test('autoprops: unpackPerm props overflow', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
    },
  }

  const packed = [I(0), I(1), I(2), I(3)]
  const expected: TPermutation[] = [
    {
      values: [I(0)],
      lengths: [I(2)],
      propKeys: ['a'],
      childrenKeys: [],
    },
    {
      values: [I(1)],
      lengths: [I(2)],
      propKeys: ['a'],
      childrenKeys: [],
    },
    {
      values: [I(0)],
      lengths: [I(2)],
      propKeys: ['a'],
      childrenKeys: [],
    },
    {
      values: [I(1)],
      lengths: [I(2)],
      propKeys: ['a'],
      childrenKeys: [],
    },
  ]

  t.deepEquals(
    packed.map((value) => unpackPerm(config, value)),
    expected,
    'should return proper perms'
  )

  t.end()
})
