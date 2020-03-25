import test from 'tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { TPackageRelease } from '../../src/types'
import { prefixes } from '../prefixes'

test('git:writeDependenciesCommit: no dependencies', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../../src/git/write-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const packages: TPackageRelease[] = [{
    name: 'a',
    dir: 'fakes/a',
    json: {
      name: '@ns/a',
      version: '0.0.1',
    },
    type: 'patch',
    version: '0.1.1',
    deps: null,
    devDeps: null,
    messages: null,
  }]

  const { writeDependenciesCommit } = await import('../../src/git/write-dependencies-commit')

  await writeDependenciesCommit()({
    config: {},
    packages,
    prefixes,
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['add', '-u']],
      ['git', ['commit', '-m', '♻️ upgrade dependencies']],
    ],
    'empty array'
  )

  unmock()
})

test('git:writeDependenciesCommit: single dependency', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../../src/git/write-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const packages: TPackageRelease[] = [{
    name: 'a',
    dir: 'fakes/a',
    json: {
      name: '@ns/a',
      version: '0.0.1',
    },
    type: 'patch',
    version: null,
    deps: {
      b: '~0.2.0',
    },
    devDeps: null,
    messages: null,
  }]

  const { writeDependenciesCommit } = await import('../../src/git/write-dependencies-commit')

  await writeDependenciesCommit()({
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
          '-u',
        ],
      ],
      [
        'git',
        [
          'commit',
          '-m',
          `${prefixes.dependencies} upgrade dependencies`,
        ],
      ],
    ],
    'single commit'
  )

  unmock()
})

test('git:writeDependenciesCommit: single dev dependency', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../../src/git/write-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const packages: TPackageRelease[] = [{
    name: 'a',
    dir: 'fakes/a',
    json: {
      name: '@ns/a',
      version: '0.0.1',
    },
    type: null,
    version: null,
    deps: null,
    devDeps: {
      b: '~0.2.0',
    },
    messages: null,
  }]

  const { writeDependenciesCommit } = await import('../../src/git/write-dependencies-commit')

  await writeDependenciesCommit()({
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
          '-u',
        ],
      ],
      [
        'git',
        [
          'commit',
          '-m',
          `${prefixes.dependencies} upgrade dependencies`,
        ],
      ],
    ],
    'single commit'
  )

  unmock()
})

test('git:writeDependenciesCommit: multiple packages', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../../src/git/write-dependencies-commit', {
    execa: { default: execaSpy },
  })

  const packages: TPackageRelease[] = [{
    name: 'a',
    dir: 'fakes/a',
    json: {
      name: '@ns/a',
      version: '0.0.1',
    },
    type: null,
    version: null,
    devDeps: null,
    deps: null,
    messages: null,
  }, {
    name: 'b',
    dir: 'fakes/b',
    json: {
      name: '@ns/a',
      version: '0.0.1',
    },
    type: null,
    version: null,
    devDeps: null,
    deps: {
      a: '~0.2.0',
    },
    messages: null,
  }, {
    name: 'c',
    dir: 'fakes/c',
    json: {
      name: '@ns/a',
      version: '0.0.1',
    },
    type: null,
    version: null,
    deps: null,
    devDeps: {
      b: '~0.2.0',
    },
    messages: null,
  }]

  const { writeDependenciesCommit } = await import('../../src/git/write-dependencies-commit')

  await writeDependenciesCommit()({
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
          '-u',
        ],
      ],
      [
        'git',
        [
          'commit',
          '-m',
          `${prefixes.dependencies} upgrade dependencies`,
        ],
      ],
    ],
    'multiple packages'
  )

  unmock()
})
