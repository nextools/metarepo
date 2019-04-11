import test from 'blue-tape'
import { TBumpType } from '@auto/utils'
import { bumpVersion } from '../src/bump-version'
import { TBumpOptions } from '../src/types'

test('bump:bumpVersion', (t) => {
  const options: TBumpOptions = {
    zeroBreakingChangeType: 'minor',
    shouldAlwaysBumpDependents: true,
  }

  t.strictEquals(bumpVersion('1.2.3', 'patch', options), '1.2.4', '\'1.2.3\' bumped to \'1.2.4\' as patch')
  t.strictEquals(bumpVersion('1.2', 'patch', options), '1.2.1', '\'1.2\' bumped to \'1.2.1\' as patch')
  t.strictEquals(bumpVersion('1', 'patch', options), '1.0.1', '\'1\' bumped to \'1.0.1\' as patch')
  t.strictEquals(bumpVersion('1.2.3', 'minor', options), '1.3.0', '\'1.2.3\' bumped to \'1.3.0\' as minor')
  t.strictEquals(bumpVersion('1.2', 'minor', options), '1.3.0', '\'1.2\' bumped to \'1.3.0\' as minor')
  t.strictEquals(bumpVersion('1', 'minor', options), '1.1.0', '\'1\' bumped to \'1.1.0\' as minor')
  t.strictEquals(bumpVersion('1.2.3', 'major', options), '2.0.0', '\'1.2.3\' bumped to \'2.0.0\' as major')
  t.strictEquals(bumpVersion('1.2', 'major', options), '2.0.0', '\'1.2\' bumped to \'2.0.0\' as major')
  t.strictEquals(bumpVersion('1', 'major', options), '2.0.0', '\'1\' bumped to \'2.0.0\' as major')

  t.strictEquals(bumpVersion('0.2.3', 'patch', options), '0.2.4', '\'0.2.3\' bumped to \'0.2.4\' as patch')
  t.strictEquals(bumpVersion('0.2', 'patch', options), '0.2.1', '\'0.2\' bumped to \'0.2.1\' as patch')
  t.strictEquals(bumpVersion('0', 'patch', options), '0.0.1', '\'0\' bumped to \'0.0.1\' as patch')
  t.strictEquals(bumpVersion('0.2.3', 'minor', options), '0.3.0', '\'0.2.3\' bumped to \'0.3.0\' as minor')
  t.strictEquals(bumpVersion('0.2', 'minor', options), '0.3.0', '\'0.2\' bumped to \'0.3.0\' as minor')
  t.strictEquals(bumpVersion('0', 'minor', options), '0.1.0', '\'0\' bumped to \'0.1.0\' as minor')
  t.strictEquals(bumpVersion('0.2.3', 'major', options), '0.3.0', '\'0.2.3\' bumped to \'0.3.0\' as major')
  t.strictEquals(bumpVersion('0.2', 'major', options), '0.3.0', '\'0.2\' bumped to \'0.3.0\' as major')
  t.strictEquals(bumpVersion('0', 'major', options), '0.1.0', '\'0\' bumped to \'0.1.0\' as major')

  const majorOptions: TBumpOptions = {
    zeroBreakingChangeType: 'major',
    shouldAlwaysBumpDependents: true,
  }

  t.strictEquals(bumpVersion('1.2.3', 'major', majorOptions), '2.0.0', 'major + major + major')
  t.strictEquals(bumpVersion('1.2', 'major', majorOptions), '2.0.0', 'major + major + major')
  t.strictEquals(bumpVersion('1', 'major', majorOptions), '2.0.0', 'major + major + major')

  t.strictEquals(bumpVersion('0.2.3', 'major', majorOptions), '1.0.0', 'minor + major + major')
  t.strictEquals(bumpVersion('0.2', 'major', majorOptions), '1.0.0', 'minor + major + major')

  t.strictEquals(bumpVersion('0.0.3', 'major', majorOptions), '1.0.0', 'patch + major + major')
  t.strictEquals(bumpVersion('0.0', 'major', majorOptions), '1.0.0', 'patch + major + major')
  t.strictEquals(bumpVersion('0', 'major', majorOptions), '1.0.0', 'patch + major + major')

  const minorOptions: TBumpOptions = {
    zeroBreakingChangeType: 'minor',
    shouldAlwaysBumpDependents: true,
  }

  t.strictEquals(bumpVersion('1.2.3', 'major', minorOptions), '2.0.0', 'major + major + minor')
  t.strictEquals(bumpVersion('1.2', 'major', minorOptions), '2.0.0', 'major + major + minor')
  t.strictEquals(bumpVersion('1', 'major', minorOptions), '2.0.0', 'major + major + minor')

  t.strictEquals(bumpVersion('0.2.3', 'major', minorOptions), '0.3.0', 'minor + major + minor')
  t.strictEquals(bumpVersion('0.2', 'major', minorOptions), '0.3.0', 'minor + major + minor')

  t.strictEquals(bumpVersion('0.0.3', 'major', minorOptions), '0.1.0', 'patch + major + minor')
  t.strictEquals(bumpVersion('0.0', 'major', minorOptions), '0.1.0', 'patch + major + minor')
  t.strictEquals(bumpVersion('0', 'major', minorOptions), '0.1.0', 'patch + major + minor')

  const patchOptions: TBumpOptions = {
    zeroBreakingChangeType: 'patch',
    shouldAlwaysBumpDependents: true,
  }

  t.strictEquals(bumpVersion('1.2.3', 'major', patchOptions), '2.0.0', 'major + major + patch')
  t.strictEquals(bumpVersion('1.2', 'major', patchOptions), '2.0.0', 'major + major + patch')
  t.strictEquals(bumpVersion('1', 'major', patchOptions), '2.0.0', 'major + major + patch')

  t.strictEquals(bumpVersion('0.2.3', 'major', patchOptions), '1.0.0', 'minor + major + patch')
  t.strictEquals(bumpVersion('0.2', 'major', patchOptions), '1.0.0', 'minor + major + patch')

  t.strictEquals(bumpVersion('0.0.3', 'major', patchOptions), '0.0.4', 'patch + major + patch')
  t.strictEquals(bumpVersion('0.0', 'major', patchOptions), '0.0.1', 'patch + major + patch')
  t.strictEquals(bumpVersion('0', 'major', patchOptions), '0.0.1', 'patch + major + patch')

  t.throws(() => bumpVersion('blabla', 'patch', options), /invalid version/, 'should throw on range \'blabla\'')
  t.throws(() => bumpVersion('1.2.3', 'blabla' as TBumpType, options), /invalid increment argument/, 'should throw on release type \'blabla\'')
  t.throws(() => bumpVersion('', 'patch', options), /invalid version/, 'should throw on empty range')

  t.end()
})
