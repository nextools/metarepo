import test from 'blue-tape'
import travis from '../../src/services/travis'

test('services/travis', async (t) => {
  t.equal(
    await travis({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = await travis({ TRAVIS: '1' })

  t.equal(
    result!.service,
    'travis',
    'should return config'
  )
})
