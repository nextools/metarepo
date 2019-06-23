import test from 'blue-tape'
import eslint from '../src'

test('plugin-lib-eslint: export', (t) => {
  t.equals(
    typeof eslint,
    'function',
    'must be a function'
  )

  t.end()
})
