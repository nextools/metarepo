import test from 'blue-tape'
import xargs from '../src'

test('plugin-xargs: export', (t) => {
  t.equals(
    typeof xargs,
    'function',
    'must be a function'
  )

  t.end()
})
