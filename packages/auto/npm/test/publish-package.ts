import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'

test('npm:publishPackage, default', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3',
      }),
    },
  })

  const { publishPackage } = await import('../src/publish-package')

  await publishPackage(
    {
      name: 'baz',
      dir: '/foo/bar/baz',
      version: '1.2.3',
      type: 'minor',
      deps: null,
      devDeps: null,
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://registry.npmjs.org/', '/foo/bar/baz']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-package')
})

test('npm:publishPackage, with relative directory', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3',
      }),
    },
  })

  const { publishPackage } = await import('../src/publish-package')

  await publishPackage(
    {
      name: 'baz',
      dir: '/foo/bar/baz',
      version: '1.2.3',
      type: 'minor',
      deps: null,
      devDeps: null,
    },
    {
      publishSubDirectory: 'build',
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://registry.npmjs.org/', '/foo/bar/baz/build']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-package')
})

test('npm:publishPackage, user provided registry', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3',
      }),
    },
  })

  const { publishPackage } = await import('../src/publish-package')

  await publishPackage(
    {
      name: 'baz',
      dir: '/foo/bar/baz',
      version: '1.2.3',
      type: 'minor',
      deps: null,
      devDeps: null,
    },
    {
      registry: 'https://custom-registry',
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://custom-registry', '/foo/bar/baz']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-package')
})

test('npm:publishPackage, packageJson registry', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3',
        publishConfig: {
          registry: 'https://my-registry',
        },
      }),
    },
  })

  const { publishPackage } = await import('../src/publish-package')

  await publishPackage(
    {
      name: 'baz',
      dir: '/foo/bar/baz',
      version: '1.2.3',
      type: 'minor',
      deps: null,
      devDeps: null,
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://my-registry', '/foo/bar/baz']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-package')
})

test('npm:publishPackage, priority test', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3',
        publishConfig: {
          registry: 'https://my-registry',
        },
      }),
    },
  })

  const { publishPackage } = await import('../src/publish-package')

  await publishPackage(
    {
      name: 'baz',
      dir: '/foo/bar/baz',
      version: '1.2.3',
      type: 'minor',
      deps: null,
      devDeps: null,
    },
    {
      registry: 'https://options-registry',
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://options-registry', '/foo/bar/baz']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-package')
})
