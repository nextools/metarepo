import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import type { TPackageRelease } from '../../src/types'
import { prefixes } from '../prefixes'

test('git:writePublishCommit: multiple packages', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/git/write-publish-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
  })

  const packages: TPackageRelease[] = [
    {
      name: 'ns/a',
      type: 'patch',
      version: '0.1.1',
      dir: 'fakes/a',
      json: {
        name: '@ns/a',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    },
    {
      name: 'b',
      type: 'minor',
      version: '0.2.0',
      dir: 'fakes/b',
      json: {
        name: 'b',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    },
    {
      name: 'c',
      type: null,
      version: null,
      dir: 'fakes/c',
      json: {
        name: 'c',
        version: '1.0.0',
      },
      deps: null,
      devDeps: null,
      messages: null,
    },
  ]

  const { writePublishCommit } = await import('../../src/git/write-publish-commit')

  await writePublishCommit()({
    config: {},
    packages,
    prefixes,
  })

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'git add fakes/a/package.json fakes/b/package.json',
        { stdout: null, stderr: process.stderr },
      ],
      [
        `git commit -m "${prefixes.publish} ns/a, b: release"`,
        { stdout: null, stderr: process.stderr },
      ],
    ],
    'multiple packages'
  )

  unmockRequire()
})

test('git:writePublishCommit: no packages to publish', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/git/write-publish-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
  })

  const packages: TPackageRelease[] = [
    {
      name: 'ns/a',
      type: null,
      version: null,
      dir: 'fakes/a',
      json: {
        name: '@ns/a',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    },
    {
      name: 'b',
      type: null,
      version: null,
      dir: 'fakes/b',
      json: {
        name: 'b',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    },
  ]

  const { writePublishCommit } = await import('../../src/git/write-publish-commit')

  try {
    await writePublishCommit()({
      config: {},
      packages,
      prefixes,
    })

    t.fail('should not get here')
  } catch (e) {
    t.equals(
      e.message,
      'Cannot make publish commit, no packages to publish',
      'should throw'
    )
  }

  unmockRequire()
})
