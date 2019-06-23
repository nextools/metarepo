import test from 'blue-tape'
import semaphore from '../../src/services/semaphore'

test('services/semaphore', async (t) => {
  t.equal(
    await semaphore({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = await semaphore({ SEMAPHORE: '1' })

  t.equal(
    result!.service,
    'semaphore',
    'should return config'
  )
})
