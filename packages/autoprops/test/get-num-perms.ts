import test from 'blue-tape'
import { TMetaFile } from '../src/types'
import { getNumPerms } from '../src/get-num-perms'

test('getNumPerms: simple case', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
      },
    },
    Component: () => null,
  }

  t.deepEquals(
    getNumPerms(meta),
    4,
    'should return num perms'
  )

  t.end()
})

test('getNumPerms: props mutex', (t) => {
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

  t.deepEquals(
    getNumPerms(meta),
    5,
    'should return num perms'
  )

  t.end()
})

test('getNumPerms: props mutin', (t) => {
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

  t.deepEquals(
    getNumPerms(meta),
    4,
    'should return num perms'
  )

  t.end()
})

test('getNumPerms: children', (t) => {
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

  t.deepEquals(
    getNumPerms(meta),
    4,
    'should return num perms'
  )

  t.end()
})

