import test from 'blue-tape'
import BigInt from 'big-integer'
import { stringifyBigInt } from '../src/stringify-bigint'

test('stringifyBigInt', (t) => {
  t.equals(
    stringifyBigInt(BigInt(Number.MAX_SAFE_INTEGER)),
    'p18S4dnq7',
    'should stringify'
  )

  t.end()
})
