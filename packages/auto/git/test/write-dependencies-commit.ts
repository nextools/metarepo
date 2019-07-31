import test from 'blue-tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { prefixes } from '@auto/utils/test/prefixes'

test('git:writeDependenciesCommit: no dependencies', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/write-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const { writeDependenciesCommit } = await import('../src/write-dependencies-commit')

  await writeDependenciesCommit(
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

  unmock()
})

test('git:writeDependenciesCommit: single dependency', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/write-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const { writeDependenciesCommit } = await import('../src/write-dependencies-commit')

  await writeDependenciesCommit(
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

  unmock()
})

test('git:writeDependenciesCommit: single dev dependency', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/write-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const { writeDependenciesCommit } = await import('../src/write-dependencies-commit')

  await writeDependenciesCommit(
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

  unmock()
})

test('git:writeDependenciesCommit: multiple packages', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/write-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const { writeDependenciesCommit } = await import('../src/write-dependencies-commit')

  await writeDependenciesCommit(
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

  unmock()
})
