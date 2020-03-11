import test from 'blue-tape'
import gitlab from '../../src/services/gitlab'

test('services/gitlab', (t) => {
  t.equal(
    gitlab({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = gitlab({ GITLAB_CI: '1' })

  t.equal(
    result!.service,
    'gitlab',
    'should return config'
  )

  t.end()
})
