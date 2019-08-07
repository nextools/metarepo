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

  const decimals = ['0', '1', '2', '3']
  const expected = ['1', '2', '3', null]

  t.deepEquals(
    decimals.map((value) => getNextPerm(value, meta)),
    expected,
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

  const decimals = ['0', '1', '2', '3', '4', '5', '6', '7']
  const expected = ['1', '2', '4', '4', '6', '6', null, null]

  t.deepEquals(
    decimals.map((value) => getNextPerm(value, meta)),
    expected,
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

  const decimals = ['0', '1', '2', '3', '4', '5', '6', '7']
  const expected = ['2', '2', '5', '5', '5', '7', '7', null]

  t.deepEquals(
    decimals.map((value) => getNextPerm(value, meta)),
    expected,
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

  const decimals = ['0', '1', '2', '3']
  const expected = ['1', '2', '3', null]

  t.deepEquals(
    decimals.map((value) => getNextPerm(value, meta)),
    expected,
    'should return next perm'
  )

  t.end()
})

