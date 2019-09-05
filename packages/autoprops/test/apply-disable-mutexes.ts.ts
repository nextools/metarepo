import test from 'blue-tape'
import I from 'big-integer'
import { applyDisableMutexes } from '../src/apply-disable-mutexes'

test('applyDisableMutexes', (t) => {
  const values = [I(0), I(0), I(1), I(1), I(1)]
  const expected = [I(0), I(0), I(1), I(0), I(1)]

  applyDisableMutexes(
    values,
    2,
    ['a', 'b', 'c'],
    'c',
    [
      ['a', 'b'],
      ['b', 'c', 'd'],
    ]
  )

  t.true(
    values.every((val, i) => val.equals(expected[i])),
    'should properly modify values'
  )

  t.end()
})
