import test from 'blue-tape'
import { TMetaFile } from '../src/types'
import { getNextPerm } from '../src/get-next-perm'

test('getNextPerm: simple case', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
      },
    },
    Component: () => null,
  }

  const decimals = [0n, 1n, 2n, 3n]

  t.deepEquals(
    decimals.map((value) => getNextPerm(value, meta)),
    [1n, 2n, 3n, null],
    'should return next perm'
  )

  t.end()
})

test('getNextPerm: props mutex', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
        c: [true],
      },
      mutex: [
        ['a', 'b'],
        ['a', 'c'],
      ],
    },
    Component: () => null,
  }

  const decimals = [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n]

  t.deepEquals(
    decimals.map((value) => getNextPerm(value, meta)),
    [1n, 2n, 4n, 4n, 6n, 6n, null, null],
    'should return next perm'
  )

  t.end()
})

test('getNextPerm: props mutin', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
        c: [true],
      },
      mutin: [
        ['a', 'c'],
      ],
    },
    Component: () => null,
  }

  const decimals = [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n]

  t.deepEquals(
    decimals.map((value) => getNextPerm(value, meta)),
    [2n, 2n, 5n, 5n, 5n, 7n, 7n, null],
    'should return next perm'
  )

  t.end()
})

test('getNextPerm: children', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
      },
    },
    childrenConfig: {
      meta: {
        child: {
          config: {
            props: {},
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
      children: ['child', 'child2'],
      required: ['child'],
    },
    Component: () => null,
  }

  const decimals = [0n, 1n, 2n, 3n]

  t.deepEquals(
    decimals.map((value) => getNextPerm(value, meta)),
    [1n, 2n, 3n, null],
    'should return next perm'
  )

  t.end()
})

