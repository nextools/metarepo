import test from 'tape'
import { isString } from 'tsfn'
import getConfig from '../src/getConfig'

test('getConfig', (t) => {
  const origTravisEnv = process.env.TRAVIS

  if (isString(origTravisEnv)) {
    Reflect.deleteProperty(process.env, 'TRAVIS')
  }

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

  process.env.TRAVIS = origTravisEnv ?? 'TRAVIS'

  const config = getConfig()

  t.equal(
    config.service,
    'travis',
    'must be resolved with config if CI service was found'
  )

  Reflect.deleteProperty(process.env, 'TRAVIS')

  t.end()
})
