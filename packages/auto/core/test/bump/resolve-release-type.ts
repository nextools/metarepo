import test from 'tape'
import { resolveReleaseType } from '../../src/bump/resolve-release-type'
import type { TPromptEditData } from '../../src/types'

test('resolveReleaseType', (t) => {
  t.equals(
    resolveReleaseType('0.0.1', 'patch', 'a'),
    'patch',
    'patch'
  )

  t.equals(
    resolveReleaseType('0.1.0', 'patch', 'a'),
    'patch',
    'patch'
  )

  t.equals(
    resolveReleaseType('1.0.0', 'patch', 'a'),
    'patch',
    'patch'
  )

  t.equals(
    resolveReleaseType('0.0.1', 'minor', 'a'),
    'minor',
    'minor'
  )

  t.equals(
    resolveReleaseType('0.1.0', 'minor', 'a'),
    'minor',
    'minor'
  )

  t.equals(
    resolveReleaseType('1.0.0', 'minor', 'a'),
    'minor',
    'minor'
  )

  t.equals(
    resolveReleaseType('0.0.1', 'major', 'a'),
    'minor',
    'major'
  )

  t.equals(
    resolveReleaseType('0.1.0', 'major', 'a'),
    'minor',
    'major'
  )

  t.equals(
    resolveReleaseType('1.0.0', 'major', 'a'),
    'major',
    'major'
  )

  const edit: TPromptEditData = {
    dependencyBumpIgnoreMap: new Map(),
    zeroBreakingTypeOverrideMap: new Map().set('a', 'patch').set('b', 'major'),
    initialTypeOverrideMap: new Map().set('a', 'major').set('b', 'patch'),
  }

  t.equals(
    resolveReleaseType('0.0.1', 'major', 'a', edit),
    'patch',
    'major edit'
  )

  t.equals(
    resolveReleaseType('0.1.0', 'major', 'a', edit),
    'patch',
    'major edit'
  )

  t.equals(
    resolveReleaseType('1.0.0', 'major', 'a', edit),
    'major',
    'major edit'
  )

  t.equals(
    resolveReleaseType('0.0.0', 'initial', 'a'),
    'minor',
    'initial'
  )

  t.equals(
    resolveReleaseType('0.0.0', 'initial', 'a', edit),
    'major',
    'initial edit'
  )

  t.end()
})
