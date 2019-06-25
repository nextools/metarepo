import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { prefixes } from '@auto/utils/test/prefixes'

test('git:writePublishCommit: single package', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-publish-commit', {
    execa: { default: execaSpy },
  })

  const { writePublishCommit } = await import('../src/write-publish-commit')

  await writePublishCommit(
    [{
      name: 'a',
      dir: 'fakes/a',
      type: 'patch',
      version: '0.1.1',
      deps: null,
      devDeps: null,
    }],
    prefixes,
    { autoNamePrefix: '@' }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      [
        'git',
        [
          'commit',
          '-m',
          `${prefixes.required.publish.value} a: release`,
          'fakes/a/package.json',
          'fakes/a/changelog.md',
        ],
      ],
    ],
    'single package'
  )

  unmock('../src/write-publish-commit')
})

test('git:writePublishCommit: multiple packages', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-publish-commit', {
    execa: { default: execaSpy },
  })

  const { writePublishCommit } = await import('../src/write-publish-commit')

  await writePublishCommit(
    [{
      name: '@ns/a',
      dir: 'fakes/a',
      type: 'patch',
      version: '0.1.1',
      deps: null,
      devDeps: null,
    }, {
      name: 'b',
      dir: 'fakes/b',
      type: 'minor',
      version: '0.2.0',
      deps: null,
      devDeps: null,
    }],
    prefixes,
    { autoNamePrefix: '@' }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      [
        'git',
        [
          'commit',
          '-m',
          `${prefixes.required.publish.value} ns/a, b: release`,
          'fakes/a/package.json',
          'fakes/b/package.json',
          'fakes/a/changelog.md',
          'fakes/b/changelog.md',
        ],
      ],
    ],
    'multiple packages'
  )

  unmock('../src/write-publish-commit')
})

test('git:writePublishCommit: no packages to publish', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-publish-commit', {
    execa: { default: execaSpy },
  })

  const { writePublishCommit } = await import('../src/write-publish-commit')

  await writePublishCommit(
    [{
      name: 'a',
      dir: 'fakes/a',
      type: null,
      version: null,
      deps: {
        b: '~0.2.0',
      },
      devDeps: null,
    }],
    prefixes,
    { autoNamePrefix: '@' }
  )

  t.deepEquals(
    getSpyCalls(execaSpy),
    [],
    'no packages to publish'
  )

  unmock('../src/write-publish-commit')
})
