import test from 'tape'
import semaphore from '../../src/services/semaphore'

test('services/semaphore', (t) => {
  t.equal(
    semaphore({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = semaphore({ SEMAPHORE: '1' })

  t.equal(
    result!.service,
    'semaphore',
    'should return config'
  )

  t.end()
})
