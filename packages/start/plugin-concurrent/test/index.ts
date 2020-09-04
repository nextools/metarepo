import test from 'tape'
import parallel from '../src'

test('plugin-concurrent: export', (t) => {
  t.equals(
    typeof parallel,
    'function',
    'must be a function'
  )

  t.end()
})
