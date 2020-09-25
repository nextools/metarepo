import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import type { TPackageRelease } from '../../src/types'
import { prefixes } from '../prefixes'

test('git:writeDependenciesCommit: no dependencies', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/git/write-dependencies-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
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
    getSpyCalls(spawnChildProcessSpy),
    [],
    'should not make a commit'
  )

  unmockRequire()
})

test('git:writeDependenciesCommit: single dependency', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/git/write-dependencies-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
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
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'git add fakes/a/package.json',
        { stdout: null, stderr: process.stderr },
      ],
      [
        `git commit -m "${prefixes.dependencies} upgrade dependencies"`,
        { stdout: null, stderr: process.stderr },
      ],
    ],
    'single commit'
  )

  unmockRequire()
})

test('git:writeDependenciesCommit: single dev dependency', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/git/write-dependencies-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
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
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'git add fakes/a/package.json',
        { stdout: null, stderr: process.stderr },
      ],
      [
        `git commit -m "${prefixes.dependencies} upgrade dependencies"`,
        { stdout: null, stderr: process.stderr },
      ],
    ],
    'single commit'
  )

  unmockRequire()
})

test('git:writeDependenciesCommit: multiple packages', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/git/write-dependencies-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
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
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'git add fakes/b/package.json fakes/c/package.json',
        { stdout: null, stderr: process.stderr },
      ],
      [
        `git commit -m "${prefixes.dependencies} upgrade dependencies"`,
        { stdout: null, stderr: process.stderr },
      ],
    ],
    'multiple packages'
  )

  unmockRequire()
})
