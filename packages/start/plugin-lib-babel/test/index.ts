import test from 'tape'
import babel from '../src'

test('plugin-lib-babel: export', (t) => {
  t.equals(
    typeof babel,
    'function',
    'must be a function'
  )

  t.end()
})
