import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { TRepoGitBump } from '@auto/utils/src/types'
import { prefixes } from '@auto/utils/test/prefixes'
import { TGitOptions } from '../src/types'

const gitOptions: TGitOptions = {
  initialType: 'minor',
}

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} patch 2`,
        `${prefixes.required.patch.value} patch 1`,
        `${prefixes.required.publish.value} v1.2.3`,
        `${prefixes.required.initial.value} initial`,
      ]),
    },
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(prefixes, gitOptions),
    {
      type: 'patch',
      messages: [{
        type: 'patch',
        value: 'patch 2',
      }, {
        type: 'patch',
        value: 'patch 1',
      }],
    } as TRepoGitBump,
    'bump as patch + patch'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} minor`,
        `${prefixes.required.patch.value} patch`,
        `${prefixes.required.publish.value} v1.2.3`,
        `${prefixes.required.initial.value} initial`,
      ]),
    },
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(prefixes, gitOptions),
    {
      type: 'minor',
      messages: [{
        type: 'minor',
        value: 'minor',
      }, {
        type: 'patch',
        value: 'patch',
      }],
    } as TRepoGitBump,
    'bump as patch + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} patch`,
        `${prefixes.required.minor.value} minor`,
        `${prefixes.required.publish.value} v1.2.3`,
        `${prefixes.required.initial.value} initial`,
      ]),
    },
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(prefixes, gitOptions),
    {
      type: 'minor',
      messages: [{
        type: 'patch',
        value: 'patch',
      }, {
        type: 'minor',
        value: 'minor',

      }],
    } as TRepoGitBump,
    'bump as minor + patch'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.major.value} major`,
        `${prefixes.required.minor.value} minor`,
        `${prefixes.required.patch.value} patch`,
        `${prefixes.required.publish.value} v1.2.3`,
        `${prefixes.required.initial.value} initial`,
      ]),
    },
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(prefixes, gitOptions),
    {
      type: 'major',
      messages: [{
        type: 'major',
        value: 'major',
      }, {
        type: 'minor',
        value: 'minor',
      }, {
        type: 'patch',
        value: 'patch',
      }],
    } as TRepoGitBump,
    'bump as patch + minor + major'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} minor`,
        `${prefixes.required.major.value} major`,
        `${prefixes.required.patch.value} patch`,
        `${prefixes.required.publish.value} v1.2.3`,
        `${prefixes.required.initial.value} initial`,
      ]),
    },
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(prefixes, gitOptions),
    {
      type: 'major',
      messages: [{
        type: 'minor',
        value: 'minor',

      }, {
        type: 'major',
        value: 'major',
      }, {
        type: 'patch',
        value: 'patch',
      }],
    } as TRepoGitBump,
    'bump as patch + major + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} minor`,
        `${prefixes.required.patch.value} patch`,
        `${prefixes.required.major.value} major`,
        `${prefixes.required.publish.value} v1.2.3`,
        `${prefixes.required.initial.value} initial`,
      ]),
    },
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(prefixes, gitOptions),
    {
      type: 'major',
      messages: [{
        type: 'minor',
        value: 'minor',
      }, {
        type: 'patch',
        value: 'patch',
      }, {
        type: 'major',
        value: 'major',
      }],
    } as TRepoGitBump,
    'bump as major + patch + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump skipped commits', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} minor`,
        '💥',
        'beep',
        `${prefixes.required.dependencies.value} upgrade dependencies`,
        `${prefixes.required.patch.value} patch`,
        `${prefixes.required.publish.value} v1.0.1`,
        `${prefixes.required.initial.value} initial`,
      ]),
    },
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(prefixes, gitOptions),
    {
      type: 'minor',
      messages: [{
        type: 'minor',
        value: 'minor',
      }, {
        type: 'patch',
        value: 'patch',
      }],
    } as TRepoGitBump,
    'skip invalid commit messages'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package initial only', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.initial.value} initial`,
      ]),
    },
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(prefixes, gitOptions),
    {
      type: gitOptions.initialType,
      messages: [{
        type: 'initial',
        value: 'initial',
      }],
    } as TRepoGitBump,
    'bump as initial'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package initial', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} minor`,
        `${prefixes.required.patch.value} patch`,
        `${prefixes.required.major.value} major`,
        `${prefixes.required.initial.value} initial`,
      ]),
    },
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(prefixes, gitOptions),
    {
      type: gitOptions.initialType,
      messages: [{
        type: 'minor',
        value: 'minor',
      }, {
        type: 'patch',
        value: 'patch',
      }, {
        type: 'major',
        value: 'major',
      }, {
        type: 'initial',
        value: 'initial',
      }],
    } as TRepoGitBump,
    'bump as major + patch + minor + initial'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package multiple initial', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} minor`,
        `${prefixes.required.patch.value} patch`,
        `${prefixes.required.initial.value} initial`,
        `${prefixes.required.major.value} major`,
        `${prefixes.required.initial.value} initial`,
      ]),
    },
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(prefixes, gitOptions),
    {
      type: gitOptions.initialType,
      messages: [{
        type: 'minor',
        value: 'minor',
      }, {
        type: 'patch',
        value: 'patch',
      }, {
        type: 'initial',
        value: 'initial',
      }],
    } as TRepoGitBump,
    'bump as minor + patch + initial'
  )

  unmock('../src/get-repo-bump')
})
