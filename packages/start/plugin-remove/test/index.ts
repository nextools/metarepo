import test from 'blue-tape'
import remove from '../src'

test('plugin-remove: export', (t) => {
  t.equals(
    typeof remove,
    'function',
    'must be a function'
  )

  t.end()
})
