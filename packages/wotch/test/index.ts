import test from 'tape'
import { watch } from '../src'

test('wotch: watch', async (t) => {
  const result = await watch()

  t.equal(
    result,
    123,
    'should work'
  )
})
