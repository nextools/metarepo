import test from 'blue-tape'
import I from 'big-integer'
import { applyDisableMutins } from '../src/apply-disable-mutins'

test('applyDisableMutins: props and children', (t) => {
  const values = [I(1), I(1), I(1), I(1), I(1)]
  const expected = [I(0), I(0), I(1), I(0), I(0)]

  applyDisableMutins(
    values,
    'e',
    ['a', 'b', 'c'],
    ['d', 'e'],
    [
      ['a', 'b', 'd'],
      ['d', 'e'],
    ]
  )

  t.true(
    values.every((val, i) => val.equals(expected[i])),
    'should properly modify values'
  )

  t.end()
})
