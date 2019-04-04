import test from 'blue-tape'
import { removeAutoNamePrefix } from '../src/remove-auto-name-prefix'

test('removeAutoNamePrefix', (t) => {
  t.equals(
    removeAutoNamePrefix('@ns/a', '@ns/'),
    'a',
    'should remove prefix from the beginning'
  )

  t.equals(
    removeAutoNamePrefix('b/@ns/a', '@ns/'),
    'b/@ns/a',
    'should skip prefix in the middle'
  )

  t.end()
})
