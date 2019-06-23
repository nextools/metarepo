import test from 'blue-tape'
import webpack from '../src'

test('plugin-lib-webpack: export', (t) => {
  t.equals(
    typeof webpack,
    'function',
    'must be a function'
  )

  t.end()
})
