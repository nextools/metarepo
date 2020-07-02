import I from 'big-integer'
import test from 'tape'
import { parseBigInt } from '../src/parse-bigint'

test('autoprops: parseBigInt', (t) => {
  t.true(
    parseBigInt('p18S4dnq7').equals(I(Number.MAX_SAFE_INTEGER)),
    'should parse'
  )

  t.end()
})
