import test from 'blue-tape'
import I from 'big-integer'
import { applyEnableMutins } from '../src/apply-enable-mutins'

test('applyEnableMutins', (t) => {
  const values = [I(0), I(0), I(0), I(0), I(0), I(0)]
  const expected = [I(0), I(0), I(1), I(1), I(1), I(0)]

  applyEnableMutins(
    values,
    2,
    ['a', 'b', 'c', 'd'],
    'c',
    [['a', 'b'], ['b', 'c'], ['c', 'd']],
    ['d']
  )

  t.true(
    values.every((val, i) => val.equals(expected[i])),
    'should properly modify values'
  )

  t.end()
})
