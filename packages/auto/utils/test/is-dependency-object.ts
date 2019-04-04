import test from 'blue-tape'
import { isDependencyObject } from '../src/is-dependency-object'

test('utils/isDependencyObject', (t) => {
  t.true(
    isDependencyObject({}),
    'true'
  )

  t.false(
    isDependencyObject(null),
    'false'
  )

  t.end()
})
