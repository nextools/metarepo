import test from 'tape'
import type { TReleaseType } from '../../src/types'
import { compareReleaseTypes } from '../../src/utils/compare-release-types'

test('compare-release-types', (t) => {
  t.true(compareReleaseTypes('patch', 'patch') === 0, 'patch = patch')
  t.true(compareReleaseTypes('patch', 'minor') < 0, 'patch < minor')
  t.true(compareReleaseTypes('patch', 'major') < 0, 'patch < major')
  t.true(compareReleaseTypes('patch', 'initial') < 0, 'patch < initial')

  t.true(compareReleaseTypes('minor', 'patch') > 0, 'minor > patch')
  t.true(compareReleaseTypes('minor', 'minor') === 0, 'minor = minor')
  t.true(compareReleaseTypes('minor', 'major') < 0, 'minor < major')
  t.true(compareReleaseTypes('minor', 'initial') < 0, 'minor < initial')

  t.true(compareReleaseTypes('major', 'patch') > 0, 'major > patch')
  t.true(compareReleaseTypes('major', 'minor') > 0, 'major > minor')
  t.true(compareReleaseTypes('major', 'major') === 0, 'major = major')
  t.true(compareReleaseTypes('major', 'initial') < 0, 'major < initial')

  t.true(compareReleaseTypes('initial', 'patch') > 0, 'initial > patch')
  t.true(compareReleaseTypes('initial', 'minor') > 0, 'initial > minor')
  t.true(compareReleaseTypes('initial', 'major') > 0, 'initial > major')
  t.true(compareReleaseTypes('initial', 'initial') === 0, 'initial = initial')

  t.true(compareReleaseTypes(null, 'patch') < 0, 'null < patch')
  t.true(compareReleaseTypes(null, 'minor') < 0, 'null < minor')
  t.true(compareReleaseTypes(null, 'major') < 0, 'null < major')
  t.true(compareReleaseTypes(null, 'initial') < 0, 'null < initial')
  t.true(compareReleaseTypes('patch', null) > 0, 'patch > null')
  t.true(compareReleaseTypes('minor', null) > 0, 'minor > null')
  t.true(compareReleaseTypes('major', null) > 0, 'major > null')
  t.true(compareReleaseTypes('initial', null) > 0, 'initial > null')

  t.throws(() => compareReleaseTypes('blabla' as TReleaseType, 'patch'), /not supported/, 'throws if \'a\' is invalid type')
  t.throws(() => compareReleaseTypes('patch', 'blabla' as TReleaseType), /not supported/, 'throws if \'b\' is invalid type')

  t.end()
})
