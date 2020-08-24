import test from 'tape'
import appveyor from '../../src/services/appveyor'

test('services/appveyor', (t) => {
  t.equal(
    appveyor({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = appveyor({ APPVEYOR: '1' })

  t.equal(
    result!.service,
    'appveyor',
    'should return config'
  )

  t.end()
})
