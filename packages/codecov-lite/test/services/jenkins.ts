import test from 'blue-tape'
import jenkins from '../../src/services/jenkins'

test('services/jenkins', async (t) => {
  t.equal(
    await jenkins({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = await jenkins({ JENKINS_URL: '1' })

  t.equal(
    result!.service,
    'jenkins',
    'should return config'
  )
})
