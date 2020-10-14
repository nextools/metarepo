import test from 'tape'
import { fromIterable } from '../src'

test('obserama: createObservable', async (t) => {
  const result = await fromIterable()

  t.equal(
    result,
    123,
    'should work'
  )
})
