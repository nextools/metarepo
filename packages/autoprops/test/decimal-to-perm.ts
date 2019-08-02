import test from 'blue-tape'
import { TMetaFile } from '../src/types'
import { decimalToPerm } from '../src/decimal-to-perm'

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

  const decimals = [0n, 1n, 2n, 3n]

  t.deepEquals(
    decimals.map((value) => decimalToPerm(value, meta)),
    [
      {
        values: [0n, 0n],
        length: [2n, 2n],
      },
      {
        values: [1n, 0n],
        length: [2n, 2n],
      },
      {
        values: [0n, 1n],
        length: [2n, 2n],
      },
      {
        values: [1n, 1n],
        length: [2n, 2n],
      },
    ],
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
        child2n: {
          config: {
            props: {},
          },
          Component: () => null,
        },
      },
      children: ['child', 'child', 'child2n'],
      required: ['child'],
    },
    Component: () => null,
  }

  const decimals = [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n, 12n, 13n, 14n, 15n, 16n, 17n, 18n, 19n, 20n, 21n, 22n, 23n, 24n, 25n, 26n, 27n, 28n, 29n, 30n, 31n]

  t.deepEquals(
    decimals.map((value) => decimalToPerm(value, meta)),
    [
      {
        values: [0n, 0n, 0n, 0n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 0n, 0n, 0n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 1n, 0n, 0n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 1n, 0n, 0n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 0n, 1n, 0n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 0n, 1n, 0n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 1n, 1n, 0n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 1n, 1n, 0n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 0n, 0n, 1n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 0n, 0n, 1n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 1n, 0n, 1n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 1n, 0n, 1n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 0n, 1n, 1n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 0n, 1n, 1n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 1n, 1n, 1n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 1n, 1n, 1n, 0n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 0n, 0n, 0n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 0n, 0n, 0n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 1n, 0n, 0n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 1n, 0n, 0n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 0n, 1n, 0n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 0n, 1n, 0n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 1n, 1n, 0n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 1n, 1n, 0n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 0n, 0n, 1n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 0n, 0n, 1n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 1n, 0n, 1n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 1n, 0n, 1n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 0n, 1n, 1n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 0n, 1n, 1n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [0n, 1n, 1n, 1n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
      {
        values: [1n, 1n, 1n, 1n, 1n],
        length: [2n, 2n, 2n, 2n, 2n],
      },
    ],
    'should return proper perms'
  )

  t.end()
})
