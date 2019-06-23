import test from 'blue-tape'
import snap from '../../src/services/snap'

test('services/snap', async (t) => {
  t.equal(
    await snap({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = await snap({ SNAP_CI: '1' })

  t.equal(
    result!.service,
    'snap',
    'should return config'
  )
})
