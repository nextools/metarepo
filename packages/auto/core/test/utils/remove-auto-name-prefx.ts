import test from 'tape'
import { removeAutoNamePrefix } from '../../src/utils/remove-auto-name-prefix'

test('removeAutoNamePrefix', (t) => {
  t.equals(
    removeAutoNamePrefix('@ns/a'),
    'ns/a',
    'should remove prefix from the beginning'
  )

  t.equals(
    removeAutoNamePrefix('b/@ns/a'),
    'b/@ns/a',
    'should skip prefix in the middle'
  )

  t.end()
})
