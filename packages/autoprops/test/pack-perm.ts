import test from 'blue-tape'
import I from 'big-integer'
import { packPerm } from '../src/pack-perm'

test('autoprops: packPerm', (t) => {
  const length = [I(2), I(3), I(4)]
  const values = [
    [I(0), I(0), I(0)],
    [I(1), I(0), I(0)],
    [I(0), I(1), I(0)],
    [I(1), I(1), I(0)],
    [I(0), I(2), I(0)],
    [I(1), I(2), I(0)],
    [I(0), I(0), I(1)],
    [I(1), I(0), I(1)],
    [I(0), I(1), I(1)],
    [I(1), I(1), I(1)],
    [I(0), I(2), I(1)],
    [I(1), I(2), I(1)],
    [I(0), I(0), I(2)],
    [I(1), I(0), I(2)],
    [I(0), I(1), I(2)],
    [I(1), I(1), I(2)],
    [I(0), I(2), I(2)],
    [I(1), I(2), I(2)],
    [I(0), I(0), I(3)],
    [I(1), I(0), I(3)],
    [I(0), I(1), I(3)],
    [I(1), I(1), I(3)],
    [I(0), I(2), I(3)],
    [I(1), I(2), I(3)],
  ]

  const expected = [
    I(0),
    I(1),
    I(2),
    I(3),
    I(4),
    I(5),
    I(6),
    I(7),
    I(8),
    I(9),
    I(10),
    I(11),
    I(12),
    I(13),
    I(14),
    I(15),
    I(16),
    I(17),
    I(18),
    I(19),
    I(20),
    I(21),
    I(22),
    I(23),
  ]

  t.true(
    values
      .map((values) => packPerm(values, length))
      .every((val, i) => (val === null || expected[i] === null ? val === expected[i] : val.equals(expected[i]!))),
    'should return correct packed permutation'
  )

  t.end()
})
