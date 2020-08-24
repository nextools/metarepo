import test from 'tape'
import { bumpVersion } from '../../src/bump/bump-version'
import type { TResolvedReleaseType } from '../../src/types'

test('bump:bumpVersion', (t) => {
  t.equals(bumpVersion('1.2.3', 'patch'), '1.2.4', '\'1.2.3\' bumped to \'1.2.4\' as patch')
  t.equals(bumpVersion('1.2', 'patch'), '1.2.1', '\'1.2\' bumped to \'1.2.1\' as patch')
  t.equals(bumpVersion('1', 'patch'), '1.0.1', '\'1\' bumped to \'1.0.1\' as patch')
  t.equals(bumpVersion('1.2.3', 'minor'), '1.3.0', '\'1.2.3\' bumped to \'1.3.0\' as minor')
  t.equals(bumpVersion('1.2', 'minor'), '1.3.0', '\'1.2\' bumped to \'1.3.0\' as minor')
  t.equals(bumpVersion('1', 'minor'), '1.1.0', '\'1\' bumped to \'1.1.0\' as minor')
  t.equals(bumpVersion('1.2.3', 'major'), '2.0.0', '\'1.2.3\' bumped to \'2.0.0\' as major')
  t.equals(bumpVersion('1.2', 'major'), '2.0.0', '\'1.2\' bumped to \'2.0.0\' as major')
  t.equals(bumpVersion('1', 'major'), '2.0.0', '\'1\' bumped to \'2.0.0\' as major')

  t.equals(bumpVersion('0.2.3', 'patch'), '0.2.4', '\'0.2.3\' bumped to \'0.2.4\' as patch')
  t.equals(bumpVersion('0.2', 'patch'), '0.2.1', '\'0.2\' bumped to \'0.2.1\' as patch')
  t.equals(bumpVersion('0', 'patch'), '0.0.1', '\'0\' bumped to \'0.0.1\' as patch')
  t.equals(bumpVersion('0.2.3', 'minor'), '0.3.0', '\'0.2.3\' bumped to \'0.3.0\' as minor')
  t.equals(bumpVersion('0.2', 'minor'), '0.3.0', '\'0.2\' bumped to \'0.3.0\' as minor')
  t.equals(bumpVersion('0', 'minor'), '0.1.0', '\'0\' bumped to \'0.1.0\' as minor')
  t.equals(bumpVersion('0.2.3', 'major'), '1.0.0', '\'0.2.3\' bumped to \'1.0.0\' as major')
  t.equals(bumpVersion('0.2', 'major'), '1.0.0', '\'0.2\' bumped to \'1.0.0\' as major')
  t.equals(bumpVersion('0', 'major'), '1.0.0', '\'0\' bumped to \'1.0.0\' as major')

  t.equals(bumpVersion('0.0.3', 'major'), '1.0.0', 'patch + major + major')
  t.equals(bumpVersion('0.0', 'major'), '1.0.0', 'patch + major + major')
  t.equals(bumpVersion('0', 'major'), '1.0.0', 'patch + major + major')

  t.throws(() => bumpVersion('blabla', 'patch'), /invalid version/, 'should throw on range \'blabla\'')
  t.throws(() => bumpVersion('1.2.3', 'blabla' as TResolvedReleaseType), /invalid increment argument/, 'should throw on release type \'blabla\'')
  t.throws(() => bumpVersion('', 'patch'), /invalid version/, 'should throw on empty range')

  t.end()
})
