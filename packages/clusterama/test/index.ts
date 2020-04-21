import test from 'tape'
import { clusterama } from '../src'

test('clusterama: clusterama', async (t) => {
  const result = await clusterama()

  t.equal(
    result,
    123,
    'should work'
  )
})
