import test from 'blue-tape'
import { TComponentConfig } from '../src/types'
import { getNextPerm } from '../src/get-next-perm'

test('getNextPerm: simple case', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
  }

  const decimals = ['0', '1', '2', '3']
  const expected = ['1', '2', '3', null]

  t.deepEquals(
    decimals.map((value) => getNextPerm(config, value)),
    expected,
    'should return next perm'
  )

  t.end()
})

test('getNextPerm: props mutex', (t) => {
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

  const decimals = ['0', '1', '2', '3', '4', '5', '6', '7']
  const expected = ['1', '2', '4', '4', '6', '6', null, null]

  t.deepEquals(
    decimals.map((value) => getNextPerm(config, value)),
    expected,
    'should return next perm'
  )

  t.end()
})

test('getNextPerm: props mutin', (t) => {
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

  const decimals = ['0', '1', '2', '3', '4', '5', '6', '7']
  const expected = ['2', '2', '5', '5', '5', '7', '7', null]

  t.deepEquals(
    decimals.map((value) => getNextPerm(config, value)),
    expected,
    'should return next perm'
  )

  t.end()
})

test('getNextPerm: children', (t) => {
  const config: TComponentConfig = {
    props: {},
    children: {
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
          props: {
            a: [true],
          },
        },
        Component: () => null,
      },
    },
    required: ['child'],
  }

  const decimals = ['0', '1', '2', '3', '4', '5']
  const expected = ['1', '2', '3', '4', '5', null]

  t.deepEquals(
    decimals.map((value) => getNextPerm(config, value)),
    expected,
    'should return next perm'
  )

  t.end()
})

test('getNextPerm: props mutex children', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    mutex: [
      ['a', 'b'],
      ['a', 'child'],
    ],
    children: {

      child: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
  }

  const decimals = ['0', '1', '2', '3', '4', '5', '6', '7']
  const expected = ['1', '2', '4', '4', '6', '6', null, null]

  t.deepEquals(
    decimals.map((value) => getNextPerm(config, value)),
    expected,
    'should return next perm'
  )

  t.end()
})
