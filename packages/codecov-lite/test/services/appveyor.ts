import test from 'blue-tape'
import appveyor from '../../src/services/appveyor'

test('services/appveyor', async (t) => {
  t.equal(
    await appveyor({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = await appveyor({ APPVEYOR: '1' })

  t.equal(
    result!.service,
    'appveyor',
    'should return config'
  )
})
