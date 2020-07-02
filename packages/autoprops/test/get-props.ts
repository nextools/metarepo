import test from 'tape'
import { getProps } from '../src'
import { TCommonComponentConfig } from '../src/types'

test('autoprops: getProps single prop', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
    },
  }

  const decimals = ['0', '1', '2']

  t.deepEquals(
    decimals.map((value) => getProps(config, value)),
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
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    required: ['a'],
  }

  t.deepEquals(
    getProps(config, '0'),
    {
      a: true,
    },
    'perm 0'
  )

  t.deepEquals(
    getProps(config, '1'),
    {
      a: true,
      b: true,
    },
    'perm 1'
  )

  t.end()
})

test('autoprops: getProps empty childrenMap', (t) => {
  const config: TCommonComponentConfig = {
    props: {},
    children: {
      child: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
  }

  const decimals = ['0', '1']

  t.deepEquals(
    decimals.map((value) => getProps(config, value)),
    [
      {},
      {
        children: {
          child: {},
        },
      },
    ],
    'should return props'
  )

  t.end()
})

test('autoprops: getProps children with required', (t) => {
  const config: TCommonComponentConfig = {
    props: {},
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

  const decimals = ['0', '1']

  t.deepEquals(
    decimals.map((value) => getProps(config, value)),
    [
      {
        children: {
          child: {},
        },
      },
      {
        children: {
          child: {},
          child2: {},

        },
      },
    ],
    'should return props'
  )

  t.end()
})

test('autoprops: getProps same child placed multiple times', (t) => {
  const config: TCommonComponentConfig = {
    props: {},
    children: {
      child0: {
        config: {
          props: {},
        },
        Component: () => null,
      },
      child1: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
  }

  const decimals = ['0', '1', '2', '3']

  t.deepEquals(
    decimals.map((value) => getProps(config, value)),
    [
      {},
      {
        children: {
          child0: {},
        },
      },
      {
        children: {
          child1: {},
        },
      },
      {
        children: {
          child0: {},
          child1: {},
        },
      },
    ],
    'should return props'
  )

  t.end()
})
