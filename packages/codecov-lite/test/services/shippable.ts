import test from 'blue-tape'
import shippable from '../../src/services/shippable'

test('services/shippable', (t) => {
  t.equal(
    shippable({ FOO: '1' }),
    null,
    'should return null if not detected'
  )

  const result = shippable({ SHIPPABLE: '1' })

  t.equal(
    result!.service,
    'shippable',
    'should return config'
  )

  t.end()
})
