import test from 'blue-tape'
import { TComponentConfig } from '../src/types'
import { getNumPerms } from '../src/get-num-perms'

test('getNumPerms: simple case', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
  }

  t.equals(
    getNumPerms(config),
    4,
    'should return num perms'
  )

  t.end()
})

test('getNumPerms: props mutex', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
      b: [true],
      c: [true],
    },
    mutex: [
      ['a', 'b'],
      ['a', 'c'],
    ],
  }

  t.equals(
    getNumPerms(config),
    5,
    'should return num perms'
  )

  t.end()
})

test('getNumPerms: props mutin', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
      b: [true],
      c: [true],
    },
    mutin: [
      ['a', 'c'],
    ],
  }

  t.equals(
    getNumPerms(config),
    4,
    'should return num perms'
  )

  t.end()
})

test('getNumPerms: children', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
    },
    children: {
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
    required: ['child'],
  }

  t.equals(
    getNumPerms(config),
    4,
    'should return num perms'
  )

  t.end()
})

