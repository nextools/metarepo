import I from 'big-integer'
import test from 'tape'
import type { TCommonComponentConfig } from '../src'
import { checkDepsRestriction } from '../src/check-deps-restriction'
import { unpackPerm } from '../src/unpack-perm'

test('checkDepsRestriction', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      c: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
    deps: {
      a: ['b'],
      b: ['c'],
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
    [I(0), I(0), I(0)],
    [I(0), I(1), I(0)], // change
    [I(0), I(0), I(1)], // change
    [I(0), I(0), I(1)], // change
    [I(0), I(0), I(1)],
    [I(0), I(1), I(1)], // change
    [I(0), I(1), I(1)],
    [I(1), I(1), I(1)],
  ]

  t.deepEquals(
    values.map((values) => checkDepsRestriction(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})

test('checkDepsRestriction: required', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      c: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
    required: ['b'],
    deps: {
      a: ['b'],
      b: ['c'],
    },
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    [I(0), I(0), I(0)],
    [I(1), I(0), I(0)],
    [I(0), I(0), I(1)],
    [I(1), I(0), I(1)],
  ]
  const expected = [
    [I(0), I(0), I(1)], // changed
    [I(0), I(0), I(1)], // changed
    [I(0), I(0), I(1)],
    [I(1), I(0), I(1)],
  ]

  t.deepEquals(
    values.map((values) => checkDepsRestriction(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})

test('checkDepsRestriction: most right prop key', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    deps: {
      b: ['a'],
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
    [I(1), I(1)], // change
    [I(1), I(1)],
  ]

  t.deepEquals(
    values.map((values) => checkDepsRestriction(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})

test('checkDepsRestriction: most right child key', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      c: {
        config: {
          props: {},
        },
        Component: () => null,
      },
      d: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
    deps: {
      d: ['a', 'c', 'ne'],
    },
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    [I(0), I(0), I(0), I(0)],
    [I(1), I(0), I(0), I(0)],
    [I(0), I(1), I(0), I(0)],
    [I(1), I(1), I(0), I(0)],
    [I(0), I(0), I(1), I(0)],
    [I(1), I(0), I(1), I(0)],
    [I(0), I(1), I(1), I(0)],
    [I(1), I(1), I(1), I(0)],
    [I(0), I(0), I(0), I(1)],
    [I(1), I(0), I(0), I(1)],
    [I(0), I(1), I(0), I(1)],
    [I(1), I(1), I(0), I(1)],
    [I(0), I(0), I(1), I(1)],
    [I(1), I(0), I(1), I(1)],
    [I(0), I(1), I(1), I(1)],
    [I(1), I(1), I(1), I(1)],
  ]
  const expected = [
    [I(0), I(0), I(0), I(0)],
    [I(1), I(0), I(0), I(0)],
    [I(0), I(1), I(0), I(0)],
    [I(1), I(1), I(0), I(0)],
    [I(0), I(0), I(1), I(0)],
    [I(1), I(0), I(1), I(0)],
    [I(0), I(1), I(1), I(0)],
    [I(1), I(1), I(1), I(0)],
    [I(1), I(0), I(1), I(1)], // change
    [I(1), I(0), I(1), I(1)], // change
    [I(1), I(0), I(1), I(1)], // changed
    [I(1), I(0), I(1), I(1)], // changed
    [I(1), I(0), I(1), I(1)], // changed
    [I(1), I(0), I(1), I(1)],
    [I(1), I(1), I(1), I(1)], // changed
    [I(1), I(1), I(1), I(1)],
  ]

  t.deepEquals(
    values.map((values) => checkDepsRestriction(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})

test('checkDepsRestriction: reference on itself', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    deps: {
      a: ['a', 'b', 'a'],
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
    [I(0), I(1)], // changed
    [I(0), I(1)],
    [I(1), I(1)],
  ]

  t.deepEquals(
    values.map((values) => checkDepsRestriction(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})

test('checkDepsRestriction: nothing to do', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      c: {
        config: {
          props: {},
        },
        Component: () => null,
      },
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
  const expected = values.slice()

  t.deepEquals(
    values.map((values) => checkDepsRestriction(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})
