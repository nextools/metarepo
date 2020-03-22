import test from 'tape'
import appveyor from '../../src/services/circle'

test('services/circle', (t) => {
  t.equal(
    appveyor({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = appveyor({ CIRCLECI: '1' })

  t.equal(
    result!.service,
    'circleci',
    'should return config'
  )

  t.end()
})
