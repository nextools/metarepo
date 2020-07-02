import I from 'big-integer'
import test from 'tape'
import { applyDisableDeps } from '../src/apply-disable-deps'
import { TCommonComponentConfig } from '../src/types'
import { unpackPerm } from '../src/unpack-perm'

test('applyDisableDeps: props and children', (t) => {
  const childMeta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
      c: [true],
    },
    children: {
      d: childMeta,
      e: childMeta,
    },
    deps: {
      a: ['b', 'd'],
      b: ['d'],
      d: ['e'],
    },
  }
  const permConfig = unpackPerm(config, I(0))
  const values = [
    I(1), I(1), I(1), I(1), I(0),
  ]
  const expected = [
    I(0), I(0), I(1), I(0), I(0),
  ]

  applyDisableDeps(
    values,
    'e',
    permConfig,
    config
  )

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyDisableDeps: required dependent', (t) => {
  const childMeta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
      c: [true],
    },
    children: {
      d: childMeta,
      e: childMeta,
    },
    required: ['a', 'c'],
    deps: {
      a: ['b', 'd'],
      b: ['d'],
      d: ['e'],
      ne: ['e'],
    },
  }
  const permConfig = unpackPerm(config, I(0))
  const values = [
    I(0), I(0), I(0), I(1), I(0),
  ]
  const expected = [
    I(0), I(1), I(0), I(1), I(1),
  ]

  applyDisableDeps(
    values,
    'e',
    permConfig,
    config
  )

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})
