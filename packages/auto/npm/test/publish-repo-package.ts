/* eslint-disable prefer-promise-reject-errors */
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'

const rootDir = process.cwd()

test('npm:publishRepoPackage, default', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-repo-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getRepoPackage: () => Promise.resolve({
        name: 'a',
        version: '1.2.3',
      }),
    },
  })

  const { publishRepoPackage } = await import('../src/publish-repo-package')

  await publishRepoPackage()

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://registry.npmjs.org/', rootDir]],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-repo-package')
})

test('npm:publishRepoPackage, with relative directory', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-repo-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getRepoPackage: () => Promise.resolve({
        name: 'a',
        version: '1.2.3',
      }),
    },
  })

  const { publishRepoPackage } = await import('../src/publish-repo-package')

  await publishRepoPackage({
    publishSubDirectory: 'build',
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://registry.npmjs.org/', `${rootDir}/build`]],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-repo-package')
})

test('npm:publishRepoPackage, user provided registry', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-repo-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getRepoPackage: () => Promise.resolve({
        name: 'a',
        version: '1.2.3',
      }),
    },
  })

  const { publishRepoPackage } = await import('../src/publish-repo-package')

  await publishRepoPackage({
    registry: 'https://my-registry',
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://my-registry', rootDir]],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-repo-package')
})

test('npm:publishRepoPackage, packageJson registry', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-repo-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getRepoPackage: () => Promise.resolve({
        name: 'a',
        version: '1.2.3',
        publishConfig: {
          registry: 'https://my-registry',
        },
      }),
    },
  })

  const { publishRepoPackage } = await import('../src/publish-repo-package')

  await publishRepoPackage()

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://my-registry', rootDir]],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-repo-package')
})

test('npm:publishRepoPackage, priority test', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-repo-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getRepoPackage: () => Promise.resolve({
        name: 'a',
        version: '1.2.3',
        publishConfig: {
          registry: 'https://publish-config-registry',
        },
      }),
    },
  })

  const { publishRepoPackage } = await import('../src/publish-repo-package')

  await publishRepoPackage({
    registry: 'https://options-registry',
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://options-registry', rootDir]],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-repo-package')
})
