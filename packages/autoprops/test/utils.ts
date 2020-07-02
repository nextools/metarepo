import I from 'big-integer'
import test from 'tape'
import { getIncrementedValueIndex } from '../src/utils'

test('getChangedValueIndex', (t) => {
  t.equals(
    getIncrementedValueIndex([I(0), I(0), I(0)]),
    0,
    'should return changed index'
  )

  t.equals(
    getIncrementedValueIndex([I(3), I(0), I(1)]),
    0,
    'should return changed index'
  )

  t.equals(
    getIncrementedValueIndex([I(0), I(0), I(1)]),
    2,
    'should return changed index'
  )

  t.end()
})
