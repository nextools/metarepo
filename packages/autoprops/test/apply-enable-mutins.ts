import test from 'blue-tape'
import I from 'big-integer'
import { applyEnableMutins } from '../src/apply-enable-mutins'

test('applyEnableMutins: props and children', (t) => {
  const values = [I(0), I(0), I(0), I(0), I(0), I(0), I(0)]
  const expected = [I(1), I(0), I(1), I(0), I(1), I(0), I(1)]

  applyEnableMutins(
    values,
    'a',
    ['a', 'b', 'c'],
    ['d', 'e', 'f', 'g'],
    [
      ['a', 'c'],
      ['c', 'd', 'e', 'g'],
      ['d', 'f'],
    ],
    ['d']
  )

  t.true(
    values.every((val, i) => val.equals(expected[i])),
    'should properly modify values'
  )

  t.end()
})
