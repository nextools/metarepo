import test from 'tape'
import travis from '../../src/services/travis'

test('services/travis', (t) => {
  t.equal(
    travis({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = travis({ TRAVIS: '1' })

  t.equal(
    result!.service,
    'travis',
    'should return config'
  )

  t.end()
})
