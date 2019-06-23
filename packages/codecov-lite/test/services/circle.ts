import test from 'blue-tape'
import appveyor from '../../src/services/circle'

test('services/circle', async (t) => {
  t.equal(
    await appveyor({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = await appveyor({ CIRCLECI: '1' })

  t.equal(
    result!.service,
    'circleci',
    'should return config'
  )
})
