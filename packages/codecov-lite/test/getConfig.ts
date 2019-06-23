import test from 'blue-tape'
import getConfig from '../src/getConfig'

test('getConfig', (t) => {
  try {
    getConfig()
    t.fail('should not get here')
  } catch (error) {
    t.equal(
      error.message,
      'CODECOV_TOKEN env variable is not set',
      'must fail if CODECOV_TOKEN env variable is not set'
    )
  }

  process.env.CODECOV_TOKEN = 'TEST'

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

  process.env.TRAVIS = 'TEST'

  const config = getConfig()

  t.equal(
    config.service,
    'travis',
    'must be resolved with config if CI service was found'
  )

  Reflect.deleteProperty(process.env, 'TRAVIS')
  Reflect.deleteProperty(process.env, 'CODECOV_TOKEN')

  t.end()
})
