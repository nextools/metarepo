import test from 'tape'
import I from 'big-integer'
import { applyDisableDeps } from '../src/apply-disable-deps'
import { TCommonComponentConfig } from '../src/types'
import { unpackPerm } from '../src/unpack-perm'

test('applyDisableDeps: props and children', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
      c: [true],
    },
    children: {
      d: {
        config: {
          props: {},
        },
        Component: () => null,
      },
      e: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
    deps: {
      a: ['b', 'd'],
      b: ['d'],
      d: ['e'],
    },
  }
  const permConfig = unpackPerm(config, I(0))
  const values = [
    I(1), I(1), I(1), I(1), I(1),
  ]
  const expected = [
    I(0), I(0), I(1), I(0), I(1),
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
