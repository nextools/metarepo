import test from 'tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { TPackageRelease } from '../../src/types'
import { prefixes } from '../prefixes'

test('git:writePublishCommit: multiple packages', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../../src/git/write-publish-commit', {
    execa: { default: execaSpy },
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
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      [
        'git',
        [
          'add',
          'fakes/a/package.json',
          'fakes/b/package.json',
        ],
      ],
      [
        'git',
        [
          'commit',
          '-m',
          `${prefixes.publish} ns/a, b: release`,
        ],
      ],
    ],
    'multiple packages'
  )

  unmock()
})

test('git:writePublishCommit: no packages to publish', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../../src/git/write-publish-commit', {
    execa: { default: execaSpy },
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

  unmock()
})
