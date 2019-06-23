import test from 'blue-tape'
import rollup from '../src'

test('plugin-lib-rollup: export', (t) => {
  t.equals(
    typeof rollup,
    'function',
    'must be a function'
  )

  t.end()
})
