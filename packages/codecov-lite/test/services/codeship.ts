import test from 'blue-tape'
import appveyor from '../../src/services/codeship'

test('services/codeship', async (t) => {
  t.equal(
    await appveyor({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = await appveyor({ CI_NAME: 'codeship' })

  t.equal(
    result!.service,
    'codeship',
    'should return config'
  )
})
