import test from 'blue-tape'
import I from 'big-integer'
import { getNumSkipMutin } from '../src/get-num-skip-mutin'

test('getNumSkipMutin', (t) => {
  t.equals(
    getNumSkipMutin(
      [I(0), I(1), I(1)],
      [I(2), I(2), I(2)],
      ['a', 'b'],
      ['c'],
      ['a', 'c']
    ).toString(),
    '1',
    'left index case'
  )

  t.equals(
    getNumSkipMutin(
      [I(0), I(1), I(0), I(1)],
      [I(4), I(4), I(4), I(4)],
      ['a', 'b'],
      ['c', 'd'],
      ['a', 'b', 'c']
    ).toString(),
    '12',
    'middle index case'
  )

  t.equals(
    getNumSkipMutin(
      [I(0), I(0), I(0), I(0), I(1)],
      [I(4), I(4), I(4), I(4), I(4)],
      ['a', 'b', 'c'],
      ['d', 'e'],
      ['a', 'c', 'e']
    ).toString(),
    '17',
    'right index case'
  )

  t.end()
})
