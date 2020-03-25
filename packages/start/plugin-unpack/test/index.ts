import test from 'tape'
import decompress from '../src'

test('plugin-decompress: export', (t) => {
  t.equals(
    typeof decompress,
    'function',
    'must be a function'
  )

  t.end()
})
