import test from 'blue-tape'
import wercker from '../../src/services/wercker'

test('services/wercker', (t) => {
  t.equal(
    wercker({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = wercker({ WERCKER_MAIN_PIPELINE_STARTED: '1' })

  t.equal(
    result!.service,
    'wercker',
    'should return config'
  )

  t.end()
})
