import test from 'blue-tape'
import { compareReleaseTypes } from '../src/compare-release-types'
import { TBumpType } from '../src/types'

test('compare-release-types', (t) => {
  t.true(compareReleaseTypes('patch', 'patch') === 0, 'patch = patch')
  t.true(compareReleaseTypes('patch', 'minor') < 0, 'patch < minor')
  t.true(compareReleaseTypes('patch', 'major') < 0, 'patch < major')

  t.true(compareReleaseTypes('minor', 'patch') > 0, 'minor > patch')
  t.true(compareReleaseTypes('minor', 'minor') === 0, 'minor = minor')
  t.true(compareReleaseTypes('minor', 'major') < 0, 'minor < major')

  t.true(compareReleaseTypes('major', 'patch') > 0, 'major > patch')
  t.true(compareReleaseTypes('major', 'minor') > 0, 'major > minor')
  t.true(compareReleaseTypes('major', 'major') === 0, 'major = major')

  t.true(compareReleaseTypes(null, 'patch') < 0, 'null < patch')
  t.true(compareReleaseTypes(null, 'minor') < 0, 'null < minor')
  t.true(compareReleaseTypes(null, 'major') < 0, 'null < major')
  t.true(compareReleaseTypes('patch', null) > 0, 'patch > patch')
  t.true(compareReleaseTypes('minor', null) > 0, 'minor > patch')
  t.true(compareReleaseTypes('major', null) > 0, 'major > patch')

  t.throws(() => compareReleaseTypes('blabla' as TBumpType, 'patch'), /not supported/, 'throws if \'a\' is invalid type')
  t.throws(() => compareReleaseTypes('patch', 'blabla' as TBumpType), /not supported/, 'throws if \'b\' is invalid type')

  t.end()
})
