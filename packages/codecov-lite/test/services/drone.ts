import test from 'blue-tape'
import drone from '../../src/services/drone'

test('services/drone', async (t) => {
  t.equal(
    await drone({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = await drone({ DRONE: '1' })

  t.equal(
    result!.service,
    'drone.io',
    'should return config'
  )
})
