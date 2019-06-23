import test from 'blue-tape'
import reporterVerbose from '../src'

test('reporter-verbose: export', (t) => {
  t.equals(
    typeof reporterVerbose,
    'function',
    'must be a function'
  )

  t.end()
})
