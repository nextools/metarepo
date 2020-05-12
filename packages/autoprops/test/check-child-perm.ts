import test from 'tape'
import I from 'big-integer'
import { checkChildPerm } from '../src/check-child-perm'
import { unpackPerm } from '../src/unpack-perm'
import { TCommonComponentConfig } from '../src'

test('checkChildPerm: child props deps', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
    },
    children: {
      c: {
        config: {
          props: {
            a: [true],
            b: [true],
          },
          deps: {
            a: ['b'],
          },
        },
        Component: () => null,
      },
    },
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    [I(0), I(0)],
    [I(1), I(0)],
    [I(0), I(1)],
    [I(1), I(1)],
    [I(0), I(2)],
    [I(1), I(2)],
    [I(0), I(3)],
    [I(1), I(3)],
    [I(0), I(4)],
    [I(1), I(4)],
    [I(0), I(5)],
    [I(1), I(5)],
    [I(0), I(6)],
    [I(1), I(6)],
  ]
  const expected = [
    [I(0), I(0)],
    [I(1), I(0)],
    [I(0), I(1)],
    [I(1), I(1)],
    [I(0), I(3)], // changed
    [I(1), I(3)], // changed
    [I(0), I(3)],
    [I(1), I(3)],
    [I(0), I(4)],
    [I(1), I(4)],
    null,
    null,
    null,
    null,
  ]

  t.deepEquals(
    values.map((values) => checkChildPerm(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})

test('checkChildPerm: child required props', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
    },
    children: {
      c: {
        config: {
          props: {
            a: [true],
            b: [true],
          },
          required: ['b'],
        },
        Component: () => null,
      },
    },
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    [I(0), I(0)],
    [I(1), I(0)],
    [I(0), I(1)],
    [I(1), I(1)],
    [I(0), I(2)],
    [I(1), I(2)],
    [I(0), I(3)],
    [I(1), I(3)],
    [I(0), I(4)],
    [I(1), I(4)],
    [I(0), I(5)],
    [I(1), I(5)],
    [I(0), I(6)],
    [I(1), I(6)],
  ]
  const expected = [
    [I(0), I(0)],
    [I(1), I(0)],
    [I(0), I(1)],
    [I(1), I(1)],
    [I(0), I(2)],
    [I(1), I(2)],
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]

  t.deepEquals(
    values.map((values) => checkChildPerm(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})

test('checkChildPerm: child mutex props', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
    },
    children: {
      c: {
        config: {
          props: {
            a: [true],
            b: [true],
          },
          mutex: [['a', 'b']],
        },
        Component: () => null,
      },
    },
  }
  const perm = unpackPerm(config, I(0))
  const values = [
    [I(0), I(0)],
    [I(1), I(0)],
    [I(0), I(1)],
    [I(1), I(1)],
    [I(0), I(2)],
    [I(1), I(2)],
    [I(0), I(3)],
    [I(1), I(3)],
    [I(0), I(4)],
    [I(1), I(4)],
    [I(0), I(5)],
    [I(1), I(5)],
    [I(0), I(6)],
    [I(1), I(6)],
  ]
  const expected = [
    [I(0), I(0)],
    [I(1), I(0)],
    [I(0), I(1)],
    [I(1), I(1)],
    [I(0), I(2)],
    [I(1), I(2)],
    [I(0), I(3)],
    [I(1), I(3)],
    null,
    null,
    null,
    null,
    null,
    null,
  ]

  t.deepEquals(
    values.map((values) => checkChildPerm(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})

test('checkChildPerm: nothing to do', (t) => {
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
    [I(0), I(0), I(1)],
    [I(1), I(0), I(1)],
    [I(0), I(1), I(1)],
    [I(1), I(1), I(1)],
  ]
  const expected = values.slice()

  t.deepEquals(
    values.map((values) => checkChildPerm(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})
