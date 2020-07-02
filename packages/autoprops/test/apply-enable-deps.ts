import I from 'big-integer'
import test from 'tape'
import { TCommonComponentConfig } from '../src'
import { applyEnableDeps } from '../src/apply-enable-deps'
import { unpackPerm } from '../src/unpack-perm'

test('applyEnableDeps: props and children', (t) => {
  const meta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      p0: [true],
      p1: [true], // not affected
      p2: [true], // not affected
      p3: [true], // required
      p4: [true], // required
      p5: [true], // prop dep
      p6: [true], // prop dep
      p7: [true], // child dep
      p8: [true], // child dep
    },
    children: {
      c0: meta,
      c1: meta, // not affected
      c2: meta, // not affected
      c3: meta, // required
      c4: meta, // required
      c5: meta, // child dep
      c6: meta, // child dep
      c7: meta, // prop dep
      c8: meta, // prop dep
    },
    deps: {
      p0: ['p5', 'p6', 'c7', 'c8', 'p3', 'p4', 'c0'],
      c0: ['c5', 'c6', 'p7', 'p8', 'c3', 'c4', 'p0'],
      p3: ['c3'],
      c3: ['p3'],
    },
    required: ['p3', 'p4', 'c3', 'c4'],
  }
  const perm = unpackPerm(config, I(0))
  const values = [I(0), I(0), I(0), I(0), I(0), I(0), I(0), I(0), I(0), /* children */ I(0), I(0), I(0), I(0), I(0), I(0), I(0), I(0), I(0)]
  const expect = [I(0), I(0), I(0), I(0), I(0), I(1), I(1), I(1), I(1), /* children */ I(1), I(0), I(0), I(0), I(0), I(1), I(1), I(1), I(1)]

  applyEnableDeps(
    values,
    'p0',
    perm,
    config
  )

  t.deepEquals(
    values,
    expect,
    'should properly modify values'
  )

  t.end()
})

test('applyEnableDeps: required prop enables dependencies', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      p0: [true],
      p1: [true],
    },
    children: {
      c0: {
        config: { props: {} },
        Component: () => null,
      },
    },
    deps: {
      p0: ['p1', 'c0'],
    },
    required: ['p0'],
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    I(0), I(0), I(0),
  ]
  const expected = [
    I(0), I(1), I(1),
  ]

  applyEnableDeps(
    values,
    'p0',
    perm,
    config
  )

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyEnableDeps: required dependencies loop', (t) => {
  const meta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      p0: [true],
      p1: [true],
    },
    children: {
      c0: meta,
      c1: meta,
    },
    deps: {
      p0: ['c0'],
      c0: ['p0'],
    },
    required: ['p0', 'c0'],
  }
  const perm = unpackPerm(config, I(0))
  const values = [I(0), I(0), I(0), I(0)]
  const expected = [I(0), I(0), I(0), I(0)]

  applyEnableDeps(
    values,
    'p0',
    perm,
    config
  )

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyEnableDeps: dependencies loop', (t) => {
  const meta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      p1: [true],
      p2: [true],
    },
    children: {
      c1: meta,
      c2: meta,
    },
    deps: {
      p1: ['c1'],
      c1: ['p1'],
    },
  }
  const perm = unpackPerm(config, I(0))
  const values = [I(0), I(0), I(0), I(0)]
  const expected = [I(0), I(0), I(1), I(0)]

  applyEnableDeps(
    values,
    'p1',
    perm,
    config
  )

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyEnableDeps: deps disables mutex', (t) => {
  const meta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      p1: [true],
      p2: [true],
    },
    children: {
      c1: meta,
      c2: meta,
    },
    deps: {
      p1: ['c1'],
    },
    mutex: [
      ['c1', 'c2'],
      ['c1', 'p2'],
    ],
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    I(0), I(1), I(0), I(1),
  ]
  const expected = [
    I(0), I(0), I(1), I(0),
  ]

  applyEnableDeps(
    values,
    'p1',
    perm,
    config
  )

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyEnableDeps: all deps enabled', (t) => {
  const meta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      p1: [true],
      p2: [true],
    },
    children: {
      c1: meta,
      c2: meta,
    },
    deps: {
      p1: ['c1', 'c2'],
      c1: ['p1', 'p2'],
    },
  }
  const perm = unpackPerm(config, I(0))
  const values = [I(0), I(1), I(0), I(1)]
  const expected = [I(0), I(1), I(1), I(1)]

  applyEnableDeps(
    values,
    'p1',
    perm,
    config
  )

  t.deepEquals(
    values,
    expected,
    'should properly modify values'
  )

  t.end()
})
