import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { TGitBump, TPackages } from '@auto/utils/src/types'
import { prefixes } from '@auto/utils/test/prefixes'
import { TGitOptions } from '../src/types'

const gitOptions: TGitOptions = {
  initialType: 'minor',
}

const packages: TPackages = {
  foo: {
    dir: 'fakes/foo',
    json: {
      name: 'foo',
      version: '0.1.2',
    },
  },
  bar: {
    dir: 'fakes/bar',
    json: {
      name: 'bar',
      version: '2.1.0',
    },
  },
  baz: {
    dir: 'fakes/baz',
    json: {
      name: 'baz',
      version: '0.0.0',
    },
  },
}

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} foo: patch 2`,
        `${prefixes.required.patch.value} foo: patch 1`,
        `${prefixes.required.publish.value} foo: v1.2.3`,
        `${prefixes.required.initial.value} foo: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'foo',
      type: 'patch',
      messages: [{
        type: 'patch',
        value: 'patch 2',
      }, {
        type: 'patch',
        value: 'patch 1',
      }],
    }] as TGitBump[],
    'bump as patch + patch'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.publish.value} foo: v1.2.3`,
        `${prefixes.required.initial.value} foo: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'foo',
      type: 'minor',
      messages: [{
        type: 'minor',
        value: 'minor',
      }, {
        type: 'patch',
        value: 'patch',
      }],
    }] as TGitBump[],
    'bump as patch + minor'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.publish.value} foo: v1.2.3`,
        `${prefixes.required.initial.value} foo: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'foo',
      type: 'minor',
      messages: [{
        type: 'patch',
        value: 'patch',
      }, {
        type: 'minor',
        value: 'minor',
      }],
    }] as TGitBump[],
    'bump as minor + patch'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.major.value} foo: major`,
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.publish.value} foo: v1.2.3`,
        `${prefixes.required.initial.value} foo: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'foo',
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
    }] as TGitBump[],
    'bump as patch + minor + major'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.major.value} foo: major`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.publish.value} foo: v1.2.3`,
        `${prefixes.required.initial.value} foo: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'foo',
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
    }] as TGitBump[],
    'bump as patch + major + minor'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.major.value} foo: major`,
        `${prefixes.required.publish.value} foo: v1.2.3`,
        `${prefixes.required.initial.value} foo: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'foo',
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
    }] as TGitBump[],
    'bump as major + patch + minor'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps multiple packages', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.publish.value} foo: v1.0.1`,
        `${prefixes.required.major.value} foo: breaking`,
        `${prefixes.required.patch.value} bar: patch`,
        `${prefixes.required.publish.value} bar: v2.0.1`,
        `${prefixes.required.major.value} bar: breaking`,
        `${prefixes.required.initial.value} foo: initial`,
        `${prefixes.required.initial.value} bar: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'foo',
      type: 'patch',
      messages: [{
        type: 'patch',
        value: 'patch',
      }],
    }, {
      name: 'bar',
      type: 'patch',
      messages: [{
        type: 'patch',
        value: 'patch',
      }],
    }] as TGitBump[],
    'bump as patch && patch'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps multiple packages in one commit', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.major.value} foo: breaking`,
        `${prefixes.required.patch.value} bar: patch`,
        `${prefixes.required.publish.value} foo, bar: release`,
        `${prefixes.required.major.value} bar: breaking`,
        `${prefixes.required.initial.value} foo: initial`,
        `${prefixes.required.initial.value} bar: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'foo',
      type: 'major',
      messages: [{
        type: 'patch',
        value: 'patch',
      }, {
        type: 'major',
        value: 'breaking',
      }],
    }, {
      name: 'bar',
      type: 'patch',
      messages: [{
        type: 'patch',
        value: 'patch',
      }],
    }] as TGitBump[],
    'bump as major && patch'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps star symbol', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} *: minor`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.patch.value} bar: patch`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'foo',
      type: 'minor',
      messages: [
        {
          type: 'minor',
          value: 'minor',
        },
        {
          type: 'patch',
          value: 'patch',
        },
      ],
    }, {
      name: 'bar',
      type: 'minor',
      messages: [
        {
          type: 'minor',
          value: 'minor',
        },
        {
          type: 'patch',
          value: 'patch',
        },
      ],
    }, {
      name: 'baz',
      type: 'minor',
      messages: [
        {
          type: 'minor',
          value: 'minor',
        },
      ],
    }] as TGitBump[],
    'bump as minor && minor'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps string + star symbol', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} ba*: minor`,
        `${prefixes.required.patch.value} foo: patch`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'bar',
      type: 'minor',
      messages: [
        {
          type: 'minor',
          value: 'minor',
        },
      ],
    }, {
      name: 'baz',
      type: 'minor',
      messages: [
        {
          type: 'minor',
          value: 'minor',
        },
      ],
    }, {
      name: 'foo',
      type: 'patch',
      messages: [
        {
          type: 'patch',
          value: 'patch',
        },
      ],
    }] as TGitBump[],
    'bump as minor && minor'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps skipped commits', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.minor.value} foo`,
        `${prefixes.required.major.value}`,
        'beep',
        `${prefixes.required.dependencies.value} foo: upgrade dependencies`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.patch.value} NonExistingPackage: patch`,
        `${prefixes.required.publish.value} foo: v1.0.1`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'foo',
      type: 'minor',
      messages: [{
        type: 'minor',
        value: 'minor',
      }, {
        type: 'patch',
        value: 'patch',
      }],
    }] as TGitBump[],
    'skip invalid commit messages'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps multiple packages initial', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.major.value} foo: breaking`,
        `${prefixes.required.patch.value} bar: patch`,
        `${prefixes.required.initial.value} baz: initial`,
        `${prefixes.required.publish.value} bar: v2.0.1`,
        `${prefixes.required.major.value} bar: breaking`,
        `${prefixes.required.initial.value} foo: initial`,
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.initial.value} bar: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(packages, prefixes, gitOptions, { autoNamePrefix: '@' }),
    [{
      name: 'foo',
      type: 'minor',
      messages: [{
        type: 'patch',
        value: 'patch',
      }, {
        type: 'major',
        value: 'breaking',
      }, {
        type: 'initial',
        value: 'initial',
      }],
    }, {
      name: 'bar',
      type: 'patch',
      messages: [{
        type: 'patch',
        value: 'patch',
      }],
    }, {
      name: 'baz',
      type: 'minor',
      messages: [{
        type: 'initial',
        value: 'initial',
      }],
    }] as TGitBump[],
    'bump as patch && patch'
  )

  unmock('../src/get-bumps')
})
