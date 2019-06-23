import test from 'blue-tape'
import spawn from '../src'

test('plugin-spawn: export', (t) => {
  t.equals(
    typeof spawn,
    'function',
    'must be a function'
  )

  t.end()
})
