import test from 'blue-tape'
import copy from '../src'

test('plugin-copy: export', (t) => {
  t.equals(
    typeof copy,
    'function',
    'must be a function'
  )

  t.end()
})
