import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { prefixes } from '@auto/utils/test/prefixes'

test('git:writeWorkspacesDependenciesCommit: no dependencies', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const { writeWorkspacesDependenciesCommit } = await import('../src/write-workspaces-dependencies-commit')

  await writeWorkspacesDependenciesCommit(
    [{
      name: 'a',
      dir: 'fakes/a',
      type: 'patch',
      version: '0.1.1',
      deps: null,
      devDeps: null,
    }],
    prefixes
  )

  t.deepEquals(
    getSpyCalls(execaSpy),
    [],
    'empty array'
  )

  unmock('../src/write-workspaces-dependencies-commit')
})

test('git:writeWorkspacesDependenciesCommit: single dependency', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const { writeWorkspacesDependenciesCommit } = await import('../src/write-workspaces-dependencies-commit')

  await writeWorkspacesDependenciesCommit(
    [{
      name: 'a',
      dir: 'fakes/a',
      type: 'patch',
      version: null,
      deps: {
        b: '~0.2.0',
      },
      devDeps: null,
    }],
    prefixes
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      [
        'git',
        [
          'commit',
          '-m',
          `${prefixes.required.dependencies.value} upgrade dependencies`,
          'fakes/a/package.json',
        ],
      ],
    ],
    'single commit'
  )

  unmock('../src/write-workspaces-dependencies-commit')
})

test('git:writeWorkspacesDependenciesCommit: single dev dependency', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const { writeWorkspacesDependenciesCommit } = await import('../src/write-workspaces-dependencies-commit')

  await writeWorkspacesDependenciesCommit(
    [{
      name: 'a',
      dir: 'fakes/a',
      type: null,
      version: null,
      deps: null,
      devDeps: {
        b: '~0.2.0',
      },
    }],
    prefixes
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      [
        'git',
        [
          'commit',
          '-m',
          `${prefixes.required.dependencies.value} upgrade dependencies`,
          'fakes/a/package.json',
        ],
      ],
    ],
    'single commit'
  )

  unmock('../src/write-workspaces-dependencies-commit')
})

test('git:writeWorkspacesDependenciesCommit: multiple packages', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const { writeWorkspacesDependenciesCommit } = await import('../src/write-workspaces-dependencies-commit')

  await writeWorkspacesDependenciesCommit(
    [{
      name: 'a',
      dir: 'fakes/a',
      type: null,
      version: null,
      devDeps: null,
      deps: null,
    }, {
      name: 'b',
      dir: 'fakes/b',
      type: null,
      version: null,
      devDeps: null,
      deps: {
        a: '~0.2.0',
      },
    }, {
      name: 'c',
      dir: 'fakes/c',
      type: null,
      version: null,
      deps: null,
      devDeps: {
        b: '~0.2.0',
      },
    }],
    prefixes
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      [
        'git',
        [
          'commit',
          '-m',
          `${prefixes.required.dependencies.value} upgrade dependencies`,
          'fakes/b/package.json',
          'fakes/c/package.json',
        ],
      ],
    ],
    'multiple packages'
  )

  unmock('../src/write-workspaces-dependencies-commit')
})
