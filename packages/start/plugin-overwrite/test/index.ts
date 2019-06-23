import test from 'blue-tape'
import overwrite from '../src'

test('plugin-overwrite: export', (t) => {
  t.equals(
    typeof overwrite,
    'function',
    'must be a function'
  )

  t.end()
})
