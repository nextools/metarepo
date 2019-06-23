import test from 'blue-tape'
import watch from '../src'

test('plugin-watch: export', (t) => {
  t.equals(
    typeof watch,
    'function',
    'must be a function'
  )

  t.end()
})
