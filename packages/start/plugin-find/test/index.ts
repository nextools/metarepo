import test from 'blue-tape'
import find from '../src'

test('plugin-find: export', (t) => {
  t.equals(
    typeof find,
    'function',
    'must be a function'
  )

  t.end()
})
