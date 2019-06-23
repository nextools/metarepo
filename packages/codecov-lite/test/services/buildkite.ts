import test from 'blue-tape'
import appveyor from '../../src/services/buildkite'

test('services/buildkite', async (t) => {
  t.equal(
    await appveyor({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = await appveyor({ BUILDKITE: '1' })

  t.equal(
    result!.service,
    'buildkite',
    'should return config'
  )
})
