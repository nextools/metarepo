import I from 'big-integer'
import test from 'tape'
import { TCommonComponentConfig } from '../src'
import { checkMutexRestriction } from '../src/check-mutex-restriction'
import { unpackPerm } from '../src/unpack-perm'

test('checkMutexRestriction', (t) => {
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
    mutex: [
      ['a', 'b'],
      ['a', 'd'],
      ['a', 'e'], // non-existing child
    ],
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
    [I(0), I(0), I(1), I(0)], // changed
    [I(0), I(0), I(1), I(0)],
    [I(1), I(0), I(1), I(0)],
    [I(0), I(1), I(1), I(0)],
    [I(0), I(0), I(0), I(1)], // changed
    [I(0), I(0), I(0), I(1)],
    [I(0), I(1), I(0), I(1)], // changed
    [I(0), I(1), I(0), I(1)],
    [I(0), I(0), I(1), I(1)], // changed
    [I(0), I(0), I(1), I(1)],
    [I(0), I(1), I(1), I(1)], // changed
    [I(0), I(1), I(1), I(1)],
    null, // changed
  ]

  t.deepEquals(
    values.map((values) => checkMutexRestriction(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})

test('checkMutexRestriction: nothing to do', (t) => {
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
    values.map((values) => checkMutexRestriction(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})
