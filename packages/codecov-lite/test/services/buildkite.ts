import test from 'tape'
import appveyor from '../../src/services/buildkite'

test('services/buildkite', (t) => {
  t.equal(
    appveyor({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = appveyor({ BUILDKITE: '1' })

  t.equal(
    result!.service,
    'buildkite',
    'should return config'
  )

  t.end()
})
