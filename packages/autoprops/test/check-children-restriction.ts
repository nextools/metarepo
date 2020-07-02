import I from 'big-integer'
import test from 'tape'
import { TCommonComponentConfig } from '../src'
import { checkChildrenRestriction } from '../src/check-children-restriction'
import { unpackPerm } from '../src/unpack-perm'

test('checkChildrenRestriction', (t) => {
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
    required: ['children'],
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
    [I(0), I(0), I(1)], // change
    [I(0), I(0), I(1)], // change
    [I(0), I(0), I(1)], // change
    [I(0), I(0), I(1)], // change
    [I(0), I(0), I(1)],
    [I(1), I(0), I(1)],
    [I(0), I(1), I(1)],
    [I(1), I(1), I(1)],
  ]

  t.deepEquals(
    values.map((values) => checkChildrenRestriction(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})

test('checkChildrenRestriction: nothing to do', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      c: {
        config: { props: {} },
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
    values.map((values) => checkChildrenRestriction(values, perm, config)),
    expected,
    'should return proper restriction'
  )

  t.end()
})
