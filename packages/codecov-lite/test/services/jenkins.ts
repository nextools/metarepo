import test from 'tape'
import jenkins from '../../src/services/jenkins'

test('services/jenkins', (t) => {
  t.equal(
    jenkins({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = jenkins({ JENKINS_URL: '1' })

  t.equal(
    result!.service,
    'jenkins',
    'should return config'
  )

  t.end()
})
