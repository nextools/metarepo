import test from 'blue-tape'
import { compareMessageTypes } from '../src/compare-message-types'
import { TBumpType } from '../src/types'

test('compare-message-types', (t) => {
  t.true(compareMessageTypes('patch', 'patch') === 0, 'patch = patch')
  t.true(compareMessageTypes('patch', 'minor') < 0, 'patch < minor')
  t.true(compareMessageTypes('patch', 'major') < 0, 'patch < major')
  t.true(compareMessageTypes('patch', 'initial') < 0, 'patch < initial')

  t.true(compareMessageTypes('minor', 'patch') > 0, 'minor > patch')
  t.true(compareMessageTypes('minor', 'minor') === 0, 'minor = minor')
  t.true(compareMessageTypes('minor', 'major') < 0, 'minor < major')
  t.true(compareMessageTypes('minor', 'initial') < 0, 'minor < initial')

  t.true(compareMessageTypes('major', 'patch') > 0, 'major > patch')
  t.true(compareMessageTypes('major', 'minor') > 0, 'major > minor')
  t.true(compareMessageTypes('major', 'major') === 0, 'major = major')
  t.true(compareMessageTypes('major', 'initial') < 0, 'major < initial')

  t.true(compareMessageTypes('initial', 'initial') === 0, 'initial = initial')

  t.true(compareMessageTypes(null, 'patch') < 0, 'null < patch')
  t.true(compareMessageTypes(null, 'minor') < 0, 'null < minor')
  t.true(compareMessageTypes(null, 'major') < 0, 'null < major')
  t.true(compareMessageTypes(null, 'initial') < 0, 'null < initial')
  t.true(compareMessageTypes('patch', null) > 0, 'patch > null')
  t.true(compareMessageTypes('minor', null) > 0, 'minor > null')
  t.true(compareMessageTypes('major', null) > 0, 'major > null')
  t.true(compareMessageTypes('initial', null) > 0, 'initial > null')

  t.throws(() => compareMessageTypes('blabla' as TBumpType, 'patch'), /not supported/, 'throws if \'a\' is invalid type')
  t.throws(() => compareMessageTypes('patch', 'blabla' as TBumpType), /not supported/, 'throws if \'b\' is invalid type')

  t.end()
})
