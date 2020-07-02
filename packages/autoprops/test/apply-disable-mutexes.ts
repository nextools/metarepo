import I from 'big-integer'
import test from 'tape'
import { applyDisableMutexes } from '../src/apply-disable-mutexes'
import { TCommonComponentConfig } from '../src/types'
import { unpackPerm } from '../src/unpack-perm'

test('applyDisableMutexes: props and children', (t) => {
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
    mutex: [
      ['a', 'b'],
      ['b', 'c', 'd', 'f'],
    ],
  }
  const permConfig = unpackPerm(config, I(0))
  const values = [
    I(0), I(0), I(1), I(1), I(1),
  ]
  const expected = [
    I(0), I(0), I(1), I(0), I(1),
  ]

  applyDisableMutexes(
    values,
    'c',
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
