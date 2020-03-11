import test from 'blue-tape'
import drone from '../../src/services/drone'

test('services/drone', (t) => {
  t.equal(
    drone({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = drone({ DRONE: '1' })

  t.equal(
    result!.service,
    'drone.io',
    'should return config'
  )

  t.end()
})
