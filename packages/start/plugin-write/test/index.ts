import test from 'blue-tape'
import write from '../src'

test('plugin-write: export', (t) => {
  t.equals(
    typeof write,
    'function',
    'must be a function'
  )

  t.end()
})
