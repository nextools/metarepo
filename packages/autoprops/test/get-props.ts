import test from 'blue-tape'
import { TMetaFile } from '../src/types'
import { getProps } from '../src'

test('autoprops: getProps single prop', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
      },
    },
    Component: () => null,
  }

  const decimals = ['0', '1', '2']

  t.deepEquals(
    decimals.map((value) => getProps(value, meta)),
    [
      {},
      {
        a: true,
      },
      {},
    ],
    'should return props'
  )

  t.end()
})

test('autoprops: getProps required props', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
      },
      required: ['a'],
    },
    Component: () => null,
  }

  t.deepEquals(
    getProps('0', meta),
    {
      a: true,
    },
    'perm 0'
  )

  t.deepEquals(
    getProps('1', meta),
    {
      a: true,
      b: true,
    },
    'perm 1'
  )

  t.end()
})

test('autoprops: getProps empty childrenMap', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {},
    },
    childrenConfig: {
      meta: {
        child: {
          config: {
            props: {},
          },
          Component: () => null,
        },
      },
      children: ['child'],
    },
    Component: () => null,
  }

  const decimals = ['0', '1']

  t.deepEquals(
    decimals.map((value) => getProps(value, meta)),
    [
      {},
      {
        children: {
          child__0: {},
        },
      },
    ],
    'should return props'
  )

  t.end()
})

test('autoprops: getProps children with required', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {},
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

  const decimals = ['0', '1']

  t.deepEquals(
    decimals.map((value) => getProps(value, meta)),
    [
      {
        children: {

          child__0: {},

        },
      },
      {
        children: {

          child__0: {},
          child2__0: {},

        },
      },
    ],
    'should return props'
  )

  t.end()
})

test('autoprops: getProps same child placed multiple times', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {},
    },
    childrenConfig: {
      meta: {
        child: {
          config: {
            props: {},
          },
          Component: () => null,
        },
      },
      children: ['child', 'child'],
    },
    Component: () => null,
  }

  const decimals = ['0', '1', '2', '3']

  t.deepEquals(
    decimals.map((value) => getProps(value, meta)),
    [
      {},
      {
        children: {
          child__0: {},
        },
      },
      {
        children: {
          child__1: {},
        },
      },
      {
        children: {
          child__0: {},
          child__1: {},
        },
      },
    ],
    'should return props'
  )

  t.end()
})
