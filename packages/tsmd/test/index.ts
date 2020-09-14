import test from 'tape'
import { tsToMd } from '../src'

test('tsmd: tsToMd', async (t) => {
  const result = await tsToMd()

  t.equal(
    result,
    123,
    'should work'
  )
})
