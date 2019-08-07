import test from 'blue-tape'
import BigInt from 'big-integer'
import { packPerm } from '../src/pack-perm'

test('packPerm', (t) => {
  const length = [BigInt(2), BigInt(3), BigInt(4)]
  const values = [
    [BigInt(0), BigInt(0), BigInt(0)],
    [BigInt(1), BigInt(0), BigInt(0)],
    [BigInt(0), BigInt(1), BigInt(0)],
    [BigInt(1), BigInt(1), BigInt(0)],
    [BigInt(0), BigInt(2), BigInt(0)],
    [BigInt(1), BigInt(2), BigInt(0)],
    [BigInt(0), BigInt(0), BigInt(1)],
    [BigInt(1), BigInt(0), BigInt(1)],
    [BigInt(0), BigInt(1), BigInt(1)],
    [BigInt(1), BigInt(1), BigInt(1)],
    [BigInt(0), BigInt(2), BigInt(1)],
    [BigInt(1), BigInt(2), BigInt(1)],
    [BigInt(0), BigInt(0), BigInt(2)],
    [BigInt(1), BigInt(0), BigInt(2)],
    [BigInt(0), BigInt(1), BigInt(2)],
    [BigInt(1), BigInt(1), BigInt(2)],
    [BigInt(0), BigInt(2), BigInt(2)],
    [BigInt(1), BigInt(2), BigInt(2)],
    [BigInt(0), BigInt(0), BigInt(3)],
    [BigInt(1), BigInt(0), BigInt(3)],
    [BigInt(0), BigInt(1), BigInt(3)],
    [BigInt(1), BigInt(1), BigInt(3)],
    [BigInt(0), BigInt(2), BigInt(3)],
    [BigInt(1), BigInt(2), BigInt(3)],
  ]

  const expected = [
    BigInt(0),
    BigInt(1),
    BigInt(2),
    BigInt(3),
    BigInt(4),
    BigInt(5),
    BigInt(6),
    BigInt(7),
    BigInt(8),
    BigInt(9),
    BigInt(10),
    BigInt(11),
    BigInt(12),
    BigInt(13),
    BigInt(14),
    BigInt(15),
    BigInt(16),
    BigInt(17),
    BigInt(18),
    BigInt(19),
    BigInt(20),
    BigInt(21),
    BigInt(22),
    BigInt(23),
  ]

  t.true(
    values
      .map((values) => packPerm(values, length))
      .every((val, i) => (val === null || expected[i] === null ? val === expected[i] : val.equals(expected[i]!))),
    'should return correct packed permutation'
  )

  t.end()
})
