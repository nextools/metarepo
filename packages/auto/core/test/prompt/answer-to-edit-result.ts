import test from 'tape'
import { answerToEditResult } from '../../src/prompt/answer-to-edit-result'
import type { TQuestionObj } from '../../src/prompt/types'
import type { TPromptEditData } from '../../src/types'

test('answerToEditResult', (t) => {
  const question: TQuestionObj = {
    dependencyBumps: {
      modified: {
        dep0: 'minor',
        dep1: 'patch',
        dep2: 'patch',
        dep3: 'initial',
      },
      leftAsIs: {
        dep0: 'minor',
        dep1: 'minor',
      },
      removed: {
        dep0: 'minor',
      },
      empty: {},
    },
    initialTypes: {
      init1: 'minor',
      init2: 'minor',
      init3: 'minor',
    },
    zeroBreakingTypes: {
      pkg1: 'minor',
      pkg2: 'minor',
      pkg3: 'minor',
    },
  }
  const answer: TQuestionObj = {
    dependencyBumps: {
      modified: {
        dep0: 'minor',
        dep2: 'incorrect type',
      },
      leftAsIs: {
        dep0: 'minor',
        dep1: 'minor',
      },
      added: {
        dep0: 'minor',
      },
    },
    initialTypes: {
      init1: 'major',
      init2: 'minor',
    },
    zeroBreakingTypes: {
      pkg1: 'major',
      pkg2: 'minor',
    },
  }

  const expectedResult: TPromptEditData = {
    dependencyBumpIgnoreMap: new Map()
      .set('modified', ['dep1', 'dep3'])
      .set('removed', ['dep0']),
    initialTypeOverrideMap: new Map()
      .set('init1', 'major'),
    zeroBreakingTypeOverrideMap: new Map()
      .set('pkg1', 'major'),
  }

  t.deepEquals(
    answerToEditResult(question, answer),
    expectedResult,
    'should be equal'
  )

  t.end()
})

test('answerToIgnore: no ignores', (t) => {
  const question: TQuestionObj = {
    dependencyBumps: {
      b: {
        a: 'minor',
      },
    },
    initialTypes: {
      init1: 'minor',
    },
    zeroBreakingTypes: {
      pkg1: 'minor',
    },
  }
  const answer: TQuestionObj = {
    dependencyBumps: {
      b: {
        a: 'minor',
      },
    },
    initialTypes: {
      init1: 'minor',
    },
    zeroBreakingTypes: {
      pkg1: 'minor',
    },
  }

  const expectedResult: TPromptEditData = {
    initialTypeOverrideMap: new Map(),
    dependencyBumpIgnoreMap: new Map(),
    zeroBreakingTypeOverrideMap: new Map(),
  }

  t.deepEquals(
    answerToEditResult(question, answer),
    expectedResult,
    'should be empty'
  )

  t.end()
})
