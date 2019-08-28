import test from 'blue-tape'
import BigInt from 'big-integer'
import { getNumSkipMutin } from '../src/get-num-skip-mutin'

test('getNumSkipMutin', (t) => {
  t.equals(
    getNumSkipMutin(
      [BigInt(0), BigInt(1), BigInt(1)],
      [BigInt(2), BigInt(2), BigInt(2)],
      [0, 2]
    ).toString(),
    '1',
    'left index case'
  )

  t.equals(
    getNumSkipMutin(
      [BigInt(0), BigInt(1), BigInt(0), BigInt(1)],
      [BigInt(4), BigInt(4), BigInt(4), BigInt(4)],
      [0, 1, 2]
    ).toString(),
    '12',
    'middle index case'
  )

  t.equals(
    getNumSkipMutin(
      [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(1)],
      [BigInt(4), BigInt(4), BigInt(4), BigInt(4), BigInt(4)],
      [0, 2, 4]
    ).toString(),
    '17',
    'right index case'
  )

  t.end()
})
