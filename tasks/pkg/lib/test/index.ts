import test from 'tape'
import { $exportedName$ } from '../src'

test('$name$: $exportedName$', async (t) => {
  const result = await $exportedName$()

  t.equal(
    result,
    123,
    'should work'
  )
})
