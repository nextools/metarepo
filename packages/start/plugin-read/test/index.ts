import test from 'blue-tape'
import read from '../src'

test('plugin-read: export', (t) => {
  t.equals(
    typeof read,
    'function',
    'must be a function'
  )

  t.end()
})
