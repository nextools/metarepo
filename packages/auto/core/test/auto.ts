import { promisify } from 'util'
import { mockRequire } from '@mock/require'
import { Volume, createFsFromVolume } from 'memfs'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import type { TPackageBumpMap } from '../src/bump/types'
import type { TPromptEditResult } from '../src/prompt/types'
import type { TAutoConfig, TPackageRelease, TGitMessageMap, TPackageMap, TPackageJson } from '../src/types'
import { prefixes } from './prefixes'

const rootDir = process.cwd()

test('auto: all hooks', async (t) => {
  const promptLogSpy = createSpy(() => {})
  const promptSpy = createSpy(() => Promise.resolve({ type: 'YES' }))
  const preBuildSpy = createSpy(() => Promise.resolve())
  const buildSpy = createSpy(() => Promise.resolve())
  const postBuildSpy = createSpy(() => Promise.resolve())
  const preDepsCommitSpy = createSpy(() => Promise.resolve())
  const depsCommitSpy = createSpy(() => Promise.resolve())
  const postDepsCommitSpy = createSpy(() => Promise.resolve())
  const prePublishCommitSpy = createSpy(() => Promise.resolve())
  const publishCommitSpy = createSpy(() => Promise.resolve())
  const postPublishCommitSpy = createSpy(() => Promise.resolve())
  const prePublishSpy = createSpy(() => Promise.resolve())
  const publishSpy = createSpy(() => Promise.resolve())
  const postPublishSpy = createSpy(() => Promise.resolve())
  const prePushSpy = createSpy(() => Promise.resolve())
  const pushSpy = createSpy(() => Promise.resolve())
  const postPushSpy = createSpy(() => Promise.resolve())
  const writePackagesDependenciesSpy = createSpy(() => Promise.resolve())
  const writePackagesVersionsSpy = createSpy(() => Promise.resolve())

  const config: TAutoConfig = {
    prefixes,
  }

  const aJson: TPackageJson = {
    name: '@ns/a',
    version: '0.0.0',
  }
  const bJson: TPackageJson = {
    name: 'b',
    version: '1.0.0',
    dependencies: {
      '@ns/a': '^0.0.0',
    },
  }
  const cJson: TPackageJson = {
    name: '@ns/c',
    version: '1.0.0',
    dependencies: {
      b: '^1.0.0',
    },
    devDependencies: {
      '@ns/a': '~0.0.0',
    },
  }

  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: 'root',
      version: '0.0.0',
      workspaces: [
        'packages/*',
      ],
      auto: config,
    }),
    [`${rootDir}/packages/a/package.json`]: JSON.stringify(aJson),
    [`${rootDir}/packages/b/package.json`]: JSON.stringify(bJson),
    [`${rootDir}/packages/c/package.json`]: JSON.stringify(cJson),
  })
  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../src/auto', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
    '../src/git/get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.initial} ns/a: init`,
      ]),
    },
    '../src/prompt/prompt-log': {
      promptLog: promptLogSpy,
    },
    '../src/prompt/make-prompt': {
      makePrompt: promptSpy,
    },
    '../src/fs/write-packages-dependencies': {
      writePackagesDependencies: writePackagesDependenciesSpy,
    },
    '../src/fs/write-packages-versions': {
      writePackagesVersions: writePackagesVersionsSpy,
    },
  })

  const { auto } = await import('../src/auto')

  await auto({
    preBuild: preBuildSpy,
    build: buildSpy,
    postBuild: postBuildSpy,
    preDepsCommit: preDepsCommitSpy,
    depsCommit: depsCommitSpy,
    postDepsCommit: postDepsCommitSpy,
    prePublishCommit: prePublishCommitSpy,
    publishCommit: publishCommitSpy,
    postPublishCommit: postPublishCommitSpy,
    prePublish: prePublishSpy,
    publish: publishSpy,
    postPublish: postPublishSpy,
    prePush: prePushSpy,
    push: pushSpy,
    postPush: postPushSpy,
  })

  const expectedPackages: TPackageMap = new Map()
    .set('@ns/a', {
      dir: `${rootDir}/packages/a`,
      json: aJson,
    })
    .set('b', {
      dir: `${rootDir}/packages/b`,
      json: bJson,
    })
    .set('@ns/c', {
      dir: `${rootDir}/packages/c`,
      json: cJson,
    })

  const expectedPackageBumps: TPackageBumpMap = new Map()
    .set('@ns/a', {
      type: 'initial',
      version: '0.1.0',
      deps: null,
      devDeps: null,
    })
    .set('b', {
      type: null,
      version: null,
      deps: {
        '@ns/a': '^0.1.0',
      },
      devDeps: null,
    })
    .set('@ns/c', {
      type: null,
      version: null,
      deps: null,
      devDeps: {
        '@ns/a': '^0.1.0',
      },
    })

  const expectedGitBumps: TGitMessageMap = new Map()
    .set('@ns/a', [{
      type: 'initial',
      message: 'init',
    }])

  const expectedReleases: TPackageRelease[] = [
    {
      name: 'ns/a',
      type: 'initial',
      version: '0.1.0',
      dir: `${rootDir}/packages/a`,
      json: {
        name: '@ns/a',
        version: '0.0.0',
      },
      deps: null,
      devDeps: null,
      messages: [{
        type: 'initial',
        message: 'init',
      }],
    },
    {
      name: 'b',
      type: null,
      version: null,
      dir: `${rootDir}/packages/b`,
      json: {
        name: 'b',
        version: '1.0.0',
        dependencies: {
          '@ns/a': '^0.0.0',
        },
      },
      deps: {
        '@ns/a': '^0.1.0',
      },
      devDeps: null,
      messages: null,
    },
    {
      name: 'ns/c',
      type: null,
      version: null,
      dir: `${rootDir}/packages/c`,
      json: {
        name: '@ns/c',
        version: '1.0.0',
        dependencies: {
          b: '^1.0.0',
        },
        devDependencies: {
          '@ns/a': '~0.0.0',
        },
      },
      deps: null,
      devDeps: {
        '@ns/a': '^0.1.0',
      },
      messages: null,
    },
  ]

  t.deepEquals(
    getSpyCalls(promptLogSpy),
    [
      [
        expectedPackageBumps,
        expectedGitBumps,
        prefixes,
      ],
    ],
    'should call promptLog'
  )

  t.deepEquals(
    getSpyCalls(promptSpy),
    [
      [
        expectedPackages,
        expectedPackageBumps,
        undefined,
      ],
    ],
    'should call promptSpy'
  )

  t.deepEquals(
    getSpyCalls(preBuildSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call preBuildSpy'
  )

  t.deepEquals(
    getSpyCalls(buildSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call buildSpy'
  )

  t.deepEquals(
    getSpyCalls(postBuildSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call postBuildSpy'
  )

  t.deepEqual(
    getSpyCalls(writePackagesDependenciesSpy),
    [
      [
        expectedReleases,
      ],
    ],
    'should not call writePackagesDependenciesSpy'
  )

  t.deepEquals(
    getSpyCalls(preDepsCommitSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call preDepsCommitSpy'
  )

  t.deepEquals(
    getSpyCalls(depsCommitSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call depsCommitSpy'
  )

  t.deepEquals(
    getSpyCalls(postDepsCommitSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call postDepsCommitSpy'
  )

  t.deepEqual(
    getSpyCalls(writePackagesVersionsSpy),
    [
      [
        expectedReleases,
      ],
    ],
    'should not call writePackagesDependenciesSpy'
  )

  t.deepEquals(
    getSpyCalls(prePublishCommitSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call prePublishCommitSpy'
  )

  t.deepEquals(
    getSpyCalls(publishCommitSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call publishCommitSpy'
  )

  t.deepEquals(
    getSpyCalls(postPublishCommitSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call postPublishCommitSpy'
  )

  t.deepEquals(
    getSpyCalls(prePublishSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call prePublishSpy'
  )

  t.deepEquals(
    getSpyCalls(publishSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call publishSpy'
  )

  t.deepEquals(
    getSpyCalls(postPublishSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call postPublishSpy'
  )

  t.deepEquals(
    getSpyCalls(prePushSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call prePushSpy'
  )

  t.deepEquals(
    getSpyCalls(pushSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call pushSpy'
  )

  t.deepEquals(
    getSpyCalls(postPushSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call postPushSpy'
  )

  unmockRequire()
})

test('auto: no hooks', async (t) => {
  const promptSpy = createSpy(() => Promise.resolve({ type: 'YES' }))
  const depsCommitSpy = createSpy(() => Promise.resolve())
  const depsCommitFSpy = createSpy(() => depsCommitSpy)
  const publishCommitSpy = createSpy(() => Promise.resolve())
  const publishCommitFSpy = createSpy(() => publishCommitSpy)
  const publishSpy = createSpy(() => Promise.resolve())
  const publishFSpy = createSpy(() => publishSpy)
  const pushSpy = createSpy(() => Promise.resolve())
  const pushFSpy = createSpy(() => pushSpy)

  const config: TAutoConfig = {
    prefixes,
  }

  const aJson: TPackageJson = {
    name: '@ns/a',
    version: '0.0.0',
  }
  const bJson: TPackageJson = {
    name: 'b',
    version: '1.0.0',
    dependencies: {
      '@ns/a': '^0.0.0',
    },
  }
  const cJson: TPackageJson = {
    name: '@ns/c',
    version: '1.0.0',
    dependencies: {
      b: '^1.0.0',
    },
    devDependencies: {
      '@ns/a': '~0.0.0',
    },
  }

  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: 'root',
      version: '0.0.0',
      workspaces: [
        'packages/*',
      ],
      auto: config,
    }),
    [`${rootDir}/packages/a/package.json`]: JSON.stringify(aJson),
    [`${rootDir}/packages/b/package.json`]: JSON.stringify(bJson),
    [`${rootDir}/packages/c/package.json`]: JSON.stringify(cJson),
  })
  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../src/auto', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
    '../src/git/get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.initial} ns/a: init`,
      ]),
    },
    '../src/git/write-dependencies-commit': {
      writeDependenciesCommit: depsCommitFSpy,
    },
    '../src/git/write-publish-commit': {
      writePublishCommit: publishCommitFSpy,
    },
    '../src/git/push-commits-and-tags': {
      pushCommitsAndTags: pushFSpy,
    },
    '../src/prompt/prompt-log': {
      promptLog: () => {},
    },
    '../src/prompt/make-prompt': {
      makePrompt: promptSpy,
    },
    '../src/npm/publish-packages': {
      publishPackages: publishFSpy,
    },
  })

  const { auto } = await import('../src/auto')

  const expectedPackages: TPackageMap = new Map()
    .set('@ns/a', {
      dir: `${rootDir}/packages/a`,
      json: aJson,
    })
    .set('b', {
      dir: `${rootDir}/packages/b`,
      json: bJson,
    })
    .set('@ns/c', {
      dir: `${rootDir}/packages/c`,
      json: cJson,
    })

  const expectedPackageBumps: TPackageBumpMap = new Map()
    .set('@ns/a', {
      type: 'initial',
      version: '0.1.0',
      deps: null,
      devDeps: null,
    })
    .set('b', {
      type: null,
      version: null,
      deps: {
        '@ns/a': '^0.1.0',
      },
      devDeps: null,
    })
    .set('@ns/c', {
      type: null,
      version: null,
      deps: null,
      devDeps: {
        '@ns/a': '^0.1.0',
      },
    })

  const expectedReleases: TPackageRelease[] = [
    {
      name: 'ns/a',
      type: 'initial',
      version: '0.1.0',
      dir: `${rootDir}/packages/a`,
      json: aJson,
      deps: null,
      devDeps: null,
      messages: [{
        type: 'initial',
        message: 'init',
      }],
    },
    {
      name: 'b',
      type: null,
      version: null,
      dir: `${rootDir}/packages/b`,
      json: bJson,
      deps: {
        '@ns/a': '^0.1.0',
      },
      devDeps: null,
      messages: null,
    },
    {
      name: 'ns/c',
      type: null,
      version: null,
      dir: `${rootDir}/packages/c`,
      json: cJson,
      deps: null,
      devDeps: {
        '@ns/a': '^0.1.0',
      },
      messages: null,
    },
  ]

  await auto()

  t.deepEquals(
    getSpyCalls(promptSpy),
    [
      [
        expectedPackages,
        expectedPackageBumps,
        undefined,
      ],
    ],
    'should call promptSpy'
  )

  t.deepEquals(
    getSpyCalls(depsCommitSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call depsCommitSpy'
  )

  t.deepEquals(
    getSpyCalls(publishCommitSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call publishCommitSpy'
  )

  t.deepEquals(
    getSpyCalls(publishSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call publishSpy'
  )

  t.deepEquals(
    getSpyCalls(pushSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call pushSpy'
  )

  unmockRequire()
})

test('auto: no hooks, prompt edit', async (t) => {
  const editResult: TPromptEditResult = {
    type: 'EDIT',
    dependencyBumpIgnoreMap: new Map(),
    initialTypeOverrideMap: new Map(),
    zeroBreakingTypeOverrideMap: new Map(),
  }

  const promptSpy = createSpy(({ index }) => (index === 0 ? Promise.resolve(editResult) : { type: 'YES' }))
  const depsCommitSpy = createSpy(() => Promise.resolve())
  const depsCommitFSpy = createSpy(() => depsCommitSpy)
  const publishCommitSpy = createSpy(() => Promise.resolve())
  const publishCommitFSpy = createSpy(() => publishCommitSpy)
  const publishSpy = createSpy(() => Promise.resolve())
  const publishFSpy = createSpy(() => publishSpy)
  const pushSpy = createSpy(() => Promise.resolve())
  const pushFSpy = createSpy(() => pushSpy)

  const config: TAutoConfig = {
    prefixes,
  }

  const aJson: TPackageJson = {
    name: '@ns/a',
    version: '0.0.0',
  }
  const bJson: TPackageJson = {
    name: 'b',
    version: '1.0.0',
    dependencies: {
      '@ns/a': '^0.0.0',
    },
  }
  const cJson: TPackageJson = {
    name: '@ns/c',
    version: '1.0.0',
    dependencies: {
      b: '^1.0.0',
    },
    devDependencies: {
      '@ns/a': '~0.0.0',
    },
  }

  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: 'root',
      version: '0.0.0',
      workspaces: [
        'packages/*',
      ],
      auto: config,
    }),
    [`${rootDir}/packages/a/package.json`]: JSON.stringify(aJson),
    [`${rootDir}/packages/b/package.json`]: JSON.stringify(bJson),
    [`${rootDir}/packages/c/package.json`]: JSON.stringify(cJson),
  })
  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../src/auto', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
    '../src/git/get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.initial} ns/a: init`,
      ]),
    },
    '../src/git/write-dependencies-commit': {
      writeDependenciesCommit: depsCommitFSpy,
    },
    '../src/git/write-publish-commit': {
      writePublishCommit: publishCommitFSpy,
    },
    '../src/git/push-commits-and-tags': {
      pushCommitsAndTags: pushFSpy,
    },
    '../src/prompt/prompt-log': {
      promptLog: () => {},
    },
    '../src/prompt/make-prompt': {
      makePrompt: promptSpy,
    },
    '../src/npm/publish-packages': {
      publishPackages: publishFSpy,
    },
  })

  const { auto } = await import('../src/auto')

  const expectedPackages: TPackageMap = new Map()
    .set('@ns/a', {
      dir: `${rootDir}/packages/a`,
      json: aJson,
    })
    .set('b', {
      dir: `${rootDir}/packages/b`,
      json: bJson,
    })
    .set('@ns/c', {
      dir: `${rootDir}/packages/c`,
      json: cJson,
    })

  const expectedPackageBumps: TPackageBumpMap = new Map()
    .set('@ns/a', {
      type: 'initial',
      version: '0.1.0',
      deps: null,
      devDeps: null,
    })
    .set('b', {
      type: null,
      version: null,
      deps: {
        '@ns/a': '^0.1.0',
      },
      devDeps: null,
    })
    .set('@ns/c', {
      type: null,
      version: null,
      deps: null,
      devDeps: {
        '@ns/a': '^0.1.0',
      },
    })

  const expectedReleases: TPackageRelease[] = [
    {
      name: 'ns/a',
      type: 'initial',
      version: '0.1.0',
      dir: `${rootDir}/packages/a`,
      json: aJson,
      deps: null,
      devDeps: null,
      messages: [{
        type: 'initial',
        message: 'init',
      }],
    },
    {
      name: 'b',
      type: null,
      version: null,
      dir: `${rootDir}/packages/b`,
      json: bJson,
      deps: {
        '@ns/a': '^0.1.0',
      },
      devDeps: null,
      messages: null,
    },
    {
      name: 'ns/c',
      type: null,
      version: null,
      dir: `${rootDir}/packages/c`,
      json: cJson,
      deps: null,
      devDeps: {
        '@ns/a': '^0.1.0',
      },
      messages: null,
    },
  ]

  await auto()

  t.deepEquals(
    getSpyCalls(promptSpy),
    [
      [
        expectedPackages,
        expectedPackageBumps,
        undefined,
      ],
      [
        expectedPackages,
        expectedPackageBumps,
        editResult,
      ],
    ],
    'should call promptSpy'
  )

  t.deepEquals(
    getSpyCalls(depsCommitSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call depsCommitSpy'
  )

  t.deepEquals(
    getSpyCalls(publishCommitSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call publishCommitSpy'
  )

  t.deepEquals(
    getSpyCalls(publishSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call publishSpy'
  )

  t.deepEquals(
    getSpyCalls(pushSpy),
    [
      [{
        config,
        prefixes,
        packages: expectedReleases,
      }],
    ],
    'should call pushSpy'
  )

  unmockRequire()
})

test('auto: no hooks, prompt unrecognized', async (t) => {
  const promptSpy = createSpy(() => ({ type: 'NO' }))
  const depsCommitSpy = createSpy(() => Promise.resolve())
  const depsCommitFSpy = createSpy(() => depsCommitSpy)
  const publishCommitSpy = createSpy(() => Promise.resolve())
  const publishCommitFSpy = createSpy(() => publishCommitSpy)
  const publishSpy = createSpy(() => Promise.resolve())
  const publishFSpy = createSpy(() => publishSpy)
  const pushSpy = createSpy(() => Promise.resolve())
  const pushFSpy = createSpy(() => pushSpy)

  const config: TAutoConfig = {
    prefixes,
  }

  const aJson: TPackageJson = {
    name: '@ns/a',
    version: '0.0.0',
  }
  const bJson: TPackageJson = {
    name: 'b',
    version: '1.0.0',
    dependencies: {
      '@ns/a': '^0.0.0',
    },
  }
  const cJson: TPackageJson = {
    name: '@ns/c',
    version: '1.0.0',
    dependencies: {
      b: '^1.0.0',
    },
    devDependencies: {
      '@ns/a': '~0.0.0',
    },
  }

  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: 'root',
      version: '0.0.0',
      workspaces: [
        'packages/*',
      ],
      auto: config,
    }),
    [`${rootDir}/packages/a/package.json`]: JSON.stringify(aJson),
    [`${rootDir}/packages/b/package.json`]: JSON.stringify(bJson),
    [`${rootDir}/packages/c/package.json`]: JSON.stringify(cJson),
  })
  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../src/auto', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
    '../src/git/get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.initial} ns/a: init`,
      ]),
    },
    '../src/git/write-dependencies-commit': {
      writeDependenciesCommit: depsCommitFSpy,
    },
    '../src/git/write-publish-commit': {
      writePublishCommit: publishCommitFSpy,
    },
    '../src/git/push-commits-and-tags': {
      pushCommitsAndTags: pushFSpy,
    },
    '../src/prompt/prompt-log': {
      promptLog: () => {},
    },
    '../src/prompt/make-prompt': {
      makePrompt: promptSpy,
    },
    '../src/npm/publish-packages': {
      publishPackages: publishFSpy,
    },
  })

  const { auto } = await import('../src/auto')

  const expectedPackages: TPackageMap = new Map()
    .set('@ns/a', {
      dir: `${rootDir}/packages/a`,
      json: aJson,
    })
    .set('b', {
      dir: `${rootDir}/packages/b`,
      json: bJson,
    })
    .set('@ns/c', {
      dir: `${rootDir}/packages/c`,
      json: cJson,
    })

  const expectedPackageBumps: TPackageBumpMap = new Map()
    .set('@ns/a', {
      type: 'initial',
      version: '0.1.0',
      deps: null,
      devDeps: null,
    })
    .set('b', {
      type: null,
      version: null,
      deps: {
        '@ns/a': '^0.1.0',
      },
      devDeps: null,
    })
    .set('@ns/c', {
      type: null,
      version: null,
      deps: null,
      devDeps: {
        '@ns/a': '^0.1.0',
      },
    })

  try {
    await auto()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e, null, 'should throw null')
  }

  t.deepEquals(
    getSpyCalls(promptSpy),
    [
      [
        expectedPackages,
        expectedPackageBumps,
        undefined,
      ],
    ],
    'should call promptSpy'
  )

  t.deepEquals(
    getSpyCalls(depsCommitSpy),
    [],
    'should not call depsCommitSpy'
  )

  t.deepEquals(
    getSpyCalls(publishCommitSpy),
    [],
    'should not call publishCommitSpy'
  )

  t.deepEquals(
    getSpyCalls(publishSpy),
    [],
    'should not call publishSpy'
  )

  t.deepEquals(
    getSpyCalls(pushSpy),
    [],
    'should not call pushSpy'
  )

  unmockRequire()
})

test('auto: rejecting hooks', async (t) => {
  const promptSpy = createSpy(() => Promise.resolve({ type: 'YES' }))
  const depsCommitSpy = createSpy(({ index }) => (index === 0 ? Promise.reject('rejecting') : Promise.resolve()))
  const publishCommitSpy = createSpy(({ index }) => (index === 0 ? Promise.reject('rejecting') : Promise.resolve()))
  const publishSpy = createSpy(({ index }) => (index === 0 ? Promise.reject('rejecting') : Promise.resolve()))
  const pushSpy = createSpy(({ index }) => (index === 0 ? Promise.reject('rejecting') : Promise.resolve()))
  const writePackagesDependenciesSpy = createSpy(() => Promise.resolve())
  const writePackagesVersionsSpy = createSpy(() => Promise.resolve())

  const config: TAutoConfig = {
    prefixes,
  }

  const aJson: TPackageJson = {
    name: '@ns/a',
    version: '0.0.0',
  }
  const bJson: TPackageJson = {
    name: 'b',
    version: '1.0.0',
    dependencies: {
      '@ns/a': '^0.0.0',
    },
  }
  const cJson: TPackageJson = {
    name: '@ns/c',
    version: '1.0.0',
    dependencies: {
      b: '^1.0.0',
    },
    devDependencies: {
      '@ns/a': '~0.0.0',
    },
  }

  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: 'root',
      version: '0.0.0',
      workspaces: [
        'packages/*',
      ],
      auto: config,
    }),
    [`${rootDir}/packages/a/package.json`]: JSON.stringify(aJson),
    [`${rootDir}/packages/b/package.json`]: JSON.stringify(bJson),
    [`${rootDir}/packages/c/package.json`]: JSON.stringify(cJson),
  })

  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../src/auto', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
    '../src/fs/write-packages-dependencies': {
      writePackagesDependencies: writePackagesDependenciesSpy,
    },
    '../src/fs/write-packages-versions': {
      writePackagesVersions: writePackagesVersionsSpy,
    },
    '../src/git/write-dependencies-commit': {
      writeDependenciesCommit: () => depsCommitSpy,
    },
    '../src/git/write-publish-commit': {
      writePublishCommit: () => publishCommitSpy,
    },
    '../src/git/push-commits-and-tags': {
      pushCommitsAndTags: () => pushSpy,
    },
    '../src/git/get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.initial} ns/a: init`,
      ]),
    },
    '../src/prompt/prompt-log': {
      promptLog: () => {},
    },
    '../src/prompt/make-prompt': {
      makePrompt: promptSpy,
    },
    '../src/npm/publish-packages': {
      publishPackages: () => publishSpy,
    },
  })

  const { auto } = await import('../src/auto')

  const expectedPackages: TPackageRelease[] = [
    {
      name: 'ns/a',
      type: 'initial',
      version: '0.1.0',
      dir: `${rootDir}/packages/a`,
      json: aJson,
      deps: null,
      devDeps: null,
      messages: [{
        type: 'initial',
        message: 'init',
      }],
    },
    {
      name: 'b',
      type: null,
      version: null,
      dir: `${rootDir}/packages/b`,
      json: bJson,
      deps: {
        '@ns/a': '^0.1.0',
      },
      devDeps: null,
      messages: null,
    },
    {
      name: 'ns/c',
      type: null,
      version: null,
      dir: `${rootDir}/packages/c`,
      json: cJson,
      deps: null,
      devDeps: {
        '@ns/a': '^0.1.0',
      },
      messages: null,
    },
  ]

  // Rejecting depsCommitSpy
  try {
    await auto()

    t.fail('should not get here')
  } catch (e) {
    t.deepEquals(
      getSpyCalls(promptSpy).length,
      1,
      'should call promptSpy'
    )

    t.deepEquals(
      getSpyCalls(writePackagesDependenciesSpy),
      [
        [expectedPackages],
      ],
      'should call writePackagesDependencies'
    )

    t.deepEquals(
      getSpyCalls(depsCommitSpy),
      [
        [{
          config,
          prefixes,
          packages: expectedPackages,
        }],
      ],
      'should call depsCommitSpy'
    )

    t.deepEquals(
      getSpyCalls(writePackagesVersionsSpy),
      [],
      'should not call writePackagesVersions'
    )

    t.deepEquals(
      getSpyCalls(publishCommitSpy),
      [],
      'should not call publishCommitSpy'
    )

    t.deepEquals(
      getSpyCalls(publishSpy),
      [],
      'should not call publishSpy'
    )

    t.deepEquals(
      getSpyCalls(pushSpy),
      [],
      'should not call pushSpy'
    )
  }

  // Rejecting publishCommitSpy
  try {
    await auto()

    t.fail('should not get here')
  } catch (e) {
    t.deepEquals(
      getSpyCalls(promptSpy).length,
      2,
      'should call promptSpy'
    )

    t.deepEquals(
      getSpyCalls(writePackagesDependenciesSpy).length,
      2,
      'should call writePackagesDependencies'
    )

    t.deepEquals(
      getSpyCalls(depsCommitSpy).length,
      2,
      'should call depsCommitSpy'
    )

    t.deepEquals(
      getSpyCalls(writePackagesVersionsSpy),
      [
        [expectedPackages],
      ],
      'should call writePackagesDependencies'
    )

    t.deepEquals(
      getSpyCalls(publishCommitSpy),
      [
        [{
          config,
          prefixes,
          packages: expectedPackages,
        }],
      ],
      'should call publishCommitSpy'
    )

    t.deepEquals(
      getSpyCalls(publishSpy),
      [],
      'should not call publishSpy'
    )

    t.deepEquals(
      getSpyCalls(pushSpy),
      [],
      'should not call pushSpy'
    )
  }

  // Rejecting publishSpy
  try {
    await auto()

    t.fail('should not get here')
  } catch (e) {
    t.deepEquals(
      getSpyCalls(promptSpy).length,
      3,
      'should call promptSpy'
    )

    t.deepEquals(
      getSpyCalls(writePackagesDependenciesSpy).length,
      3,
      'should call writePackagesDependencies'
    )

    t.deepEquals(
      getSpyCalls(depsCommitSpy).length,
      3,
      'should call depsCommitSpy'
    )

    t.deepEquals(
      getSpyCalls(writePackagesVersionsSpy).length,
      2,
      'should call writePackagesVersions'
    )

    t.deepEquals(
      getSpyCalls(publishCommitSpy).length,
      2,
      'should call publishCommitSpy'
    )

    t.deepEquals(
      getSpyCalls(publishSpy),
      [
        [{
          config,
          prefixes,
          packages: expectedPackages,
        }],
      ],
      'should call publishSpy'
    )

    t.deepEquals(
      getSpyCalls(pushSpy),
      [],
      'should not call pushSpy'
    )
  }

  // Rejecting pushSpy
  try {
    await auto()

    t.fail('should not get here')
  } catch (e) {
    t.deepEquals(
      getSpyCalls(promptSpy).length,
      4,
      'should call promptSpy'
    )

    t.deepEquals(
      getSpyCalls(depsCommitSpy).length,
      4,
      'should call depsCommitSpy'
    )

    t.deepEquals(
      getSpyCalls(publishCommitSpy).length,
      3,
      'should call publishCommitSpy'
    )

    t.deepEquals(
      getSpyCalls(publishSpy).length,
      2,
      'should call publishSpy'
    )

    t.deepEquals(
      getSpyCalls(pushSpy),
      [
        [{
          config,
          prefixes,
          packages: expectedPackages,
        }],
      ],
      'should call pushSpy'
    )
  }

  unmockRequire()
})

test('auto: disabled hooks', async (t) => {
  const promptSpy = createSpy(() => Promise.resolve({ type: 'YES' }))
  const preBuildSpy = createSpy(() => Promise.resolve())
  const postBuildSpy = createSpy(() => Promise.resolve())
  const preDepsCommitSpy = createSpy(() => Promise.resolve())
  const depsCommitSpy = createSpy(() => Promise.resolve())
  const postDepsCommitSpy = createSpy(() => Promise.resolve())
  const prePublishCommitSpy = createSpy(() => Promise.resolve())
  const publishCommitSpy = createSpy(() => Promise.resolve())
  const postPublishCommitSpy = createSpy(() => Promise.resolve())
  const prePublishSpy = createSpy(() => Promise.resolve())
  const publishSpy = createSpy(() => Promise.resolve())
  const postPublishSpy = createSpy(() => Promise.resolve())
  const prePushSpy = createSpy(() => Promise.resolve())
  const pushSpy = createSpy(() => Promise.resolve())
  const postPushSpy = createSpy(() => Promise.resolve())
  const writePackagesDependenciesSpy = createSpy(() => Promise.resolve())
  const writePackagesVersionsSpy = createSpy(() => Promise.resolve())

  const config: TAutoConfig = {
    prefixes,
  }

  const aJson: TPackageJson = {
    name: '@ns/a',
    version: '0.0.0',
  }
  const bJson: TPackageJson = {
    name: 'b',
    version: '1.0.0',
    dependencies: {
      '@ns/a': '^0.0.0',
    },
  }
  const cJson: TPackageJson = {
    name: '@ns/c',
    version: '1.0.0',
    dependencies: {
      b: '^1.0.0',
    },
    devDependencies: {
      '@ns/a': '~0.0.0',
    },
  }

  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: 'root',
      version: '0.0.0',
      workspaces: [
        'packages/*',
      ],
      auto: config,
    }),
    [`${rootDir}/packages/a/package.json`]: JSON.stringify(aJson),
    [`${rootDir}/packages/b/package.json`]: JSON.stringify(bJson),
    [`${rootDir}/packages/c/package.json`]: JSON.stringify(cJson),
  })

  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../src/auto', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
    '../src/fs/write-packages-dependencies': {
      writePackagesDependencies: writePackagesDependenciesSpy,
    },
    '../src/fs/write-packages-versions': {
      writePackagesVersions: writePackagesVersionsSpy,
    },
    '../src/git/write-dependencies-commit': {
      writeDependenciesCommit: () => depsCommitSpy,
    },
    '../src/git/write-publish-commit': {
      writePublishCommit: () => publishCommitSpy,
    },
    '../src/git/push-commits-and-tags': {
      pushCommitsAndTags: () => pushSpy,
    },
    '../src/git/get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.initial} ns/a: init`,
      ]),
    },
    '../src/prompt/prompt-log': {
      promptLog: () => {},
    },
    '../src/prompt/make-prompt': {
      makePrompt: promptSpy,
    },
    '../src/npm/publish-packages': {
      publishPackages: () => publishSpy,
    },
  })

  const { auto } = await import('../src/auto')

  await auto({
    preBuild: preBuildSpy,
    build: false,
    postBuild: postBuildSpy,
    preDepsCommit: preDepsCommitSpy,
    depsCommit: false,
    postDepsCommit: postDepsCommitSpy,
    prePublishCommit: prePublishCommitSpy,
    publishCommit: false,
    postPublishCommit: postPublishCommitSpy,
    prePublish: prePublishSpy,
    publish: false,
    postPublish: postPublishSpy,
    prePush: prePushSpy,
    push: false,
    postPush: postPushSpy,
  })

  const expectedReleases: TPackageRelease[] = [
    {
      name: 'ns/a',
      type: 'initial',
      version: '0.1.0',
      dir: `${rootDir}/packages/a`,
      json: {
        name: '@ns/a',
        version: '0.0.0',
      },
      deps: null,
      devDeps: null,
      messages: [{
        type: 'initial',
        message: 'init',
      }],
    },
    {
      name: 'b',
      type: null,
      version: null,
      dir: `${rootDir}/packages/b`,
      json: {
        name: 'b',
        version: '1.0.0',
        dependencies: {
          '@ns/a': '^0.0.0',
        },
      },
      deps: {
        '@ns/a': '^0.1.0',
      },
      devDeps: null,
      messages: null,
    },
    {
      name: 'ns/c',
      type: null,
      version: null,
      dir: `${rootDir}/packages/c`,
      json: {
        name: '@ns/c',
        version: '1.0.0',
        dependencies: {
          b: '^1.0.0',
        },
        devDependencies: {
          '@ns/a': '~0.0.0',
        },
      },
      deps: null,
      devDeps: {
        '@ns/a': '^0.1.0',
      },
      messages: null,
    },
  ]

  t.deepEqual(
    getSpyCalls(promptSpy).length,
    1,
    'should call promptSpy'
  )

  t.deepEqual(
    getSpyCalls(preBuildSpy),
    [],
    'should not call preBuildSpy'
  )

  t.deepEqual(
    getSpyCalls(postBuildSpy),
    [],
    'should not call postBuildSpy'
  )

  t.deepEqual(
    getSpyCalls(preDepsCommitSpy),
    [],
    'should not call preDepsCommit'
  )

  t.deepEqual(
    getSpyCalls(writePackagesDependenciesSpy),
    [
      [expectedReleases],
    ],
    'should not call writePackagesDependenciesSpy'
  )

  t.deepEqual(
    getSpyCalls(depsCommitSpy),
    [],
    'should not call depsCommit'
  )

  t.deepEqual(
    getSpyCalls(postDepsCommitSpy),
    [],
    'should not call postDepsCommit'
  )

  t.deepEqual(
    getSpyCalls(prePublishCommitSpy),
    [],
    'should not call prePublishCommitSpy'
  )

  t.deepEqual(
    getSpyCalls(writePackagesVersionsSpy),
    [
      [expectedReleases],
    ],
    'should not call prePackagesVersionsSpy'
  )

  t.deepEqual(
    getSpyCalls(publishCommitSpy),
    [],
    'should not call publishCommitSpy'
  )

  t.deepEqual(
    getSpyCalls(postPublishCommitSpy),
    [],
    'should not call postPublishCommitSpy'
  )

  t.deepEqual(
    getSpyCalls(prePublishSpy),
    [],
    'should not call prePublishSpy'
  )

  t.deepEqual(
    getSpyCalls(publishSpy),
    [],
    'should not call publishSpy'
  )

  t.deepEqual(
    getSpyCalls(postPublishSpy),
    [],
    'should not call postPublishSpy'
  )

  t.deepEqual(
    getSpyCalls(prePushSpy),
    [],
    'should not call prePushSpy'
  )

  t.deepEqual(
    getSpyCalls(pushSpy),
    [],
    'should not call pushSpy'
  )

  t.deepEqual(
    getSpyCalls(postPushSpy),
    [],
    'should not call postPushSpy'
  )

  unmockRequire()
})

test('auto: no config', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: 'root',
      version: '0.0.0',
      workspaces: [
        'packages/*',
      ],
    }),
    [`${rootDir}/packages/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '0.0.0',
    }),
    [`${rootDir}/packages/b/package.json`]: JSON.stringify({
      name: 'b',
      version: '1.0.0',
      dependencies: {
        '@ns/a': '^0.0.0',
      },
    }),
    [`${rootDir}/packages/c/package.json`]: JSON.stringify({
      name: '@ns/c',
      version: '1.0.0',
      dependencies: {
        b: '^1.0.0',
      },
      devDependencies: {
        '@ns/a': '~0.0.0',
      },
    }),
  })
  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../src/auto', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })

  const { auto } = await import('../src/auto')

  try {
    await auto()

    t.fail('should not get here')
  } catch (e) {
    t.equals(
      e.message,
      'Cannot find Auto Config in root package.json',
      'should throw'
    )
  }

  unmockRequire()
})

test('auto: no prefixes', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: 'root',
      version: '0.0.0',
      workspaces: [
        'packages/*',
      ],
      auto: {},
    }),
    [`${rootDir}/packages/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '0.0.0',
    }),
    [`${rootDir}/packages/b/package.json`]: JSON.stringify({
      name: 'b',
      version: '1.0.0',
      dependencies: {
        '@ns/a': '^0.0.0',
      },
    }),
    [`${rootDir}/packages/c/package.json`]: JSON.stringify({
      name: '@ns/c',
      version: '1.0.0',
      dependencies: {
        b: '^1.0.0',
      },
      devDependencies: {
        '@ns/a': '~0.0.0',
      },
    }),
  })
  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../src/auto', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })

  const { auto } = await import('../src/auto')

  try {
    await auto()

    t.fail('should not get here')
  } catch (e) {
    t.equals(
      e.message,
      'Cannot find prefixes in Auto Config',
      'should throw'
    )
  }

  unmockRequire()
})

test('auto: no bumps', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: 'root',
      version: '0.0.0',
      workspaces: [
        'packages/*',
      ],
      auto: {
        prefixes,
      },
    }),
    [`${rootDir}/packages/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '0.0.0',
    }),
    [`${rootDir}/packages/b/package.json`]: JSON.stringify({
      name: 'b',
      version: '1.0.0',
      dependencies: {
        '@ns/a': '^0.0.0',
      },
    }),
    [`${rootDir}/packages/c/package.json`]: JSON.stringify({
      name: '@ns/c',
      version: '1.0.0',
      dependencies: {
        b: '^1.0.0',
      },
      devDependencies: {
        '@ns/a': '~0.0.0',
      },
    }),
  })
  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../src/auto', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
    '../src/git/get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `some commit`,
      ]),
    },
  })

  const { auto } = await import('../src/auto')

  try {
    await auto()

    t.fail('should not get here')
  } catch (e) {
    t.equals(
      e.message,
      'No bumps',
      'should throw'
    )
  }

  unmockRequire()
})
