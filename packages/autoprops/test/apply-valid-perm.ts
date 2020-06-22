import test from 'tape'
import { applyValidPerm, TCommonComponentConfig } from '../src'

test('applyValidPerm: normal case', (t) => {
  const childMeta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      c: childMeta,
      d: childMeta,
    },
  }
  const values = ['0', '1', '2', '3']
  const expected = ['0', '1', '2', '3']

  t.deepEquals(
    values.map((v) => applyValidPerm(config, v)),
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyValidPerm: children', (t) => {
  const childMeta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      c: childMeta,
      d: childMeta,
    },
    required: ['children'],
  }
  const values = ['0', '1', '2', '3', '4', '8']
  const expected = ['4', '5', '6', '7', '4', '8']

  t.deepEquals(
    values.map((v) => applyValidPerm(config, v)),
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyValidPerm: inner children', (t) => {
  const innerMeta = { config: { props: {} }, Component: () => null }
  const childMeta = {
    config: {
      props: {},
      children: {
        c: innerMeta,
        d: innerMeta,
      },
      required: ['children'],
    },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      child: childMeta,
    },
    required: ['children'],
  }
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const expected = ['8', '9', 'a', 'b', '8', '9', 'a', 'b', '8', '9']

  t.deepEquals(
    values.map((v) => applyValidPerm(config, v)),
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyValidPerm: inner children with required', (t) => {
  const innerMeta = { config: { props: {} }, Component: () => null }
  const childMeta = {
    config: {
      props: {},
      children: {
        c: innerMeta,
        d: innerMeta,
      },
      required: ['children'],
    },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      child: childMeta,
    },
    required: ['child'],
  }
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const expected = ['4', '5', '6', '7', '4', '5', '6', '7', '8', '9']

  t.deepEquals(
    values.map((v) => applyValidPerm(config, v)),
    expected,
    'should properly modify values'
  )

  t.end()
})
