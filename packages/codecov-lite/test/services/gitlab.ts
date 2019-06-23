import test from 'blue-tape'
import gitlab from '../../src/services/gitlab'

test('services/gitlab', async (t) => {
  t.equal(
    await gitlab({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = await gitlab({ GITLAB_CI: '1' })

  t.equal(
    result!.service,
    'gitlab',
    'should return config'
  )
})
