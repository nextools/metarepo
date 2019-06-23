import test from 'blue-tape'
import rename from '../src'

test('plugin-rename: export', (t) => {
  t.equals(
    typeof rename,
    'function',
    'must be a function'
  )

  t.end()
})
