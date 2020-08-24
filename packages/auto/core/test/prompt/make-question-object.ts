import test from 'tape'
import type { TPackageBumpMap } from '../../src/bump/types'
import { makeQuestionObject } from '../../src/prompt/make-question-object'
import type { TQuestionObj } from '../../src/prompt/types'
import type { TPromptEditData, TPackageMap } from '../../src/types'
import { makeTestPackages } from './make-test-packages'

test('bumpToQuestion', (t) => {
  const { packages, bumps, prevEditResult } = makeTestPackages()

  const expectedResult: TQuestionObj = {
    initialTypes: {
      '@ns/init1': 'minor',
      '@ns/init2': 'major',
    },
    dependencyBumps: {
      'dep-major': {
        'bump-major': 'major',
      },
      'dep-patch': {
        'bump-patch': 'patch',
      },
    },
    zeroBreakingTypes: {
      'bump-major': 'minor',
      'dep-major': 'major',
    },
  }

  const question = makeQuestionObject(packages, bumps, prevEditResult)

  t.deepEquals(
    question,
    expectedResult,
    'returns question object'
  )

  t.end()
})

test('bumpToQuestion: nothing to ask', (t) => {
  const packages: TPackageMap = new Map()

  packages
    .set('a', {
      dir: 'fakes/a',
      json: {
        name: 'a',
        version: '0.0.0',
      },
    })
    .set('b', {
      dir: 'fakes/b',
      json: {
        name: 'b',
        version: '0.1.0',
        devDependencies: {
          a: '0.0.0',
        },
      },
    })
    .set('c', {
      dir: 'fakes/c',
      json: {
        name: 'c',
        version: '1.0.0',
        devDependencies: {
          b: '0.1.0',
        },
      },
    })

  const bumps: TPackageBumpMap = new Map()

  bumps
    .set('a', {
      type: 'minor',
      version: '0.1.0',
      deps: null,
      devDeps: null,
    })
    .set('b', {
      type: 'patch',
      version: '0.1.1',
      deps: null,
      devDeps: {
        a: '0.1.0',
      },
    })
    .set('c', {
      type: 'patch',
      version: '1.0.1',
      deps: null,
      devDeps: {
        b: '0.1.1',
      },
    })

  const prevEditResult: TPromptEditData = {
    initialTypeOverrideMap: new Map(),
    dependencyBumpIgnoreMap: new Map(),
    zeroBreakingTypeOverrideMap: new Map(),
  }

  const question = makeQuestionObject(packages, bumps, prevEditResult)

  t.deepEquals(
    question,
    {},
    'should return empty'
  )

  t.end()
})
