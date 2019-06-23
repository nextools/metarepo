import test from 'blue-tape'
import flowGenerate from '../src'

test('plugin-lib-flow-generate: export', (t) => {
  t.equals(
    typeof flowGenerate,
    'function',
    'must be a function'
  )

  t.end()
})
