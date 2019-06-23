import test from 'blue-tape'
import getConfig from '../src/getConfig'

test('getConfig', (t) => {
  const origTravisEnv = process.env.TRAVIS

  Reflect.deleteProperty(process.env, 'TRAVIS')

  try {
    getConfig()
    t.fail('should not get here')
  } catch (error) {
    t.equal(
      error.message,
      'No CI service was found',
      'must fail if no CI service was found'
    )
  }

  process.env.TRAVIS = origTravisEnv

  const config = getConfig()

  t.equal(
    config.service,
    'travis',
    'must be resolved with config if CI service was found'
  )

  t.end()
})
