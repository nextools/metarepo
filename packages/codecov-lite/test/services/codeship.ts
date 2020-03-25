import test from 'tape'
import appveyor from '../../src/services/codeship'

test('services/codeship', (t) => {
  t.equal(
    appveyor({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = appveyor({ CI_NAME: 'codeship' })

  t.equal(
    result!.service,
    'codeship',
    'should return config'
  )

  t.end()
})
