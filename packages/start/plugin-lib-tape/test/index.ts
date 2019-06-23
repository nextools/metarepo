import test from 'blue-tape'
import tape from '../src'

test('plugin-lib-tape: export', (t) => {
  t.equals(
    typeof tape,
    'function',
    'must be a function'
  )

  t.end()
})
