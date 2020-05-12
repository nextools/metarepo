import test from 'tape'
import I from 'big-integer'
import { applyEnableChildren } from '../src/apply-enable-children'
import { TCommonComponentConfig } from '../src/types'
import { unpackPerm } from '../src/unpack-perm'

test('applyEnableChildren: children restriction', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
    },
    children: {
      b: {
        config: { props: {} },
        Component: () => null,
      },
    },
    required: ['children'],
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    [I(0), I(0)],
    [I(1), I(0)],
    [I(0), I(1)],
    [I(1), I(1)],
  ]
  const expected = [
    [I(0), I(1)], // changed
    [I(1), I(1)], // changed
    [I(0), I(1)],
    [I(1), I(1)],
  ]

  values.forEach((v) => applyEnableChildren(v, '', perm, config))

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyEnableChildren: pick child with no deps', (t) => {
  const meta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
    },
    children: {
      c0: meta,
      c1: meta,
    },
    required: ['children'],
    deps: {
      c0: ['ne'],
    },
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    [I(0), I(0), I(0)],
    [I(1), I(0), I(0)],
    [I(0), I(1), I(0)],
    [I(1), I(1), I(0)],
    [I(0), I(0), I(1)],
    [I(1), I(0), I(1)],
    [I(0), I(1), I(1)],
    [I(1), I(1), I(1)],
  ]
  const expected = [
    [I(0), I(0), I(1)], // changed
    [I(1), I(0), I(1)], // changed
    [I(0), I(1), I(0)],
    [I(1), I(1), I(0)],
    [I(0), I(0), I(1)],
    [I(1), I(0), I(1)],
    [I(0), I(1), I(1)],
    [I(1), I(1), I(1)],
  ]

  values.forEach((v) => applyEnableChildren(v, '', perm, config))

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyEnableChildren: child transitive deps', (t) => {
  const meta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
    },
    children: {
      c0: meta,
      c1: meta,
    },
    required: ['children'],
    deps: {
      c0: ['a'],
      c1: ['ne'],
    },
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    [I(0), I(0), I(0)],
    [I(1), I(0), I(0)],
    [I(0), I(1), I(0)],
    [I(1), I(1), I(0)],
    [I(0), I(0), I(1)],
    [I(1), I(0), I(1)],
    [I(0), I(1), I(1)],
    [I(1), I(1), I(1)],
  ]
  const expected = [
    [I(1), I(1), I(0)], // changed
    [I(1), I(1), I(0)], // changed
    [I(0), I(1), I(0)],
    [I(1), I(1), I(0)],
    [I(0), I(0), I(1)],
    [I(1), I(0), I(1)],
    [I(0), I(1), I(1)],
    [I(1), I(1), I(1)],
  ]

  values.forEach((v) => applyEnableChildren(v, '', perm, config))

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyEnableChildren: no children', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    [I(0), I(0)],
    [I(1), I(0)],
    [I(0), I(1)],
    [I(1), I(1)],
  ]
  const expected = [
    [I(0), I(0)],
    [I(1), I(0)],
    [I(0), I(1)],
    [I(1), I(1)],
  ]

  values.forEach((v) => applyEnableChildren(v, '', perm, config))

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyEnableChildren: no children restriction', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
    },
    children: {
      b: {
        config: { props: {} },
        Component: () => null,
      },
    },
    required: [],
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    [I(0), I(0)],
    [I(1), I(0)],
    [I(0), I(1)],
    [I(1), I(1)],
  ]
  const expected = [
    [I(0), I(0)],
    [I(1), I(0)],
    [I(0), I(1)],
    [I(1), I(1)],
  ]

  values.forEach((v) => applyEnableChildren(v, '', perm, config))

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})
