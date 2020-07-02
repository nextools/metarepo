import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { prefixes } from '../prefixes'

test('npm:publishPackages: normal usecases', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const errorSpy = createSpy(() => {})

  const packageJsons: any = {
    'packages/a': {
      auto: {
        npm: {
          registry: 'https://a_reg',
          access: 'restricted',
        },
      },
    },
    'packages/b': {
      auto: {
        npm: {
          publishSubDirectory: 'dist',
        },
      },
    },
  }

  const unmockRequire = mockRequire('../../src/npm/publish-packages', {
    execa: { default: execaSpy },
    '../../src/fs/read-package': {
      readPackage: (dir: string) => Promise.resolve(packageJsons[dir]),
    },
    '../../src/npm/log-error': {
      logError: errorSpy,
    },
  })

  const { publishPackages } = await import('../../src/npm/publish-packages')

  await publishPackages()({
    config: {
      npm: {
        registry: 'http://global',
        access: 'public',
        publishSubDirectory: 'build',
      },
    },
    packages: [{
      name: 'a',
      version: '0.1.0',
      type: 'minor',
      dir: 'packages/a',
      json: {
        name: 'a',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    }, {
      name: 'b',
      version: '0.0.2',
      type: 'patch',
      dir: 'packages/b',
      json: {
        name: 'b',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    }],
    prefixes,
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://a_reg', '--access', 'restricted', 'packages/a/build']],
      ['npm', ['publish', '--registry', 'http://global', '--access', 'public', 'packages/b/dist']],
    ],
    'should spawn NPM with necessary arguments'
  )

  t.deepEquals(
    getSpyCalls(errorSpy).length,
    0,
    'should not call onError'
  )

  unmockRequire()
})

test('npm:publishPackages: registry override', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const onErrorSpy = createSpy(() => {})

  const packageJsons: any = {
    'packages/a': {
      auto: {
        npm: {
          registry: 'https://a_reg',
          access: 'restricted',
          publishSubDirectory: 'build',
        },
      },
    },
    'packages/b': {
      auto: {
        npm: {
          registry: 'http://b_reg',
          access: 'public',
          publishSubDirectory: 'dist',
        },
      },
    },
  }

  const unmockRequire = mockRequire('../../src/npm/publish-packages', {
    execa: { default: execaSpy },
    '../../src/fs/read-package': {
      readPackage: (dir: string) => Promise.resolve(packageJsons[dir]),
    },
  })

  const { publishPackages } = await import('../../src/npm/publish-packages')

  await publishPackages({
    registry: 'https://override',
    onError: onErrorSpy,
  })({
    config: {},
    packages: [{
      name: 'a',
      version: '0.1.0',
      type: 'minor',
      dir: 'packages/a',
      json: {
        name: 'a',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    }, {
      name: 'b',
      version: '0.0.2',
      type: 'patch',
      dir: 'packages/b',
      json: {
        name: 'b',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    }],
    prefixes,
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://override', '--access', 'restricted', 'packages/a/build']],
      ['npm', ['publish', '--registry', 'https://override', '--access', 'public', 'packages/b/dist']],
    ],
    'should spawn NPM with necessary arguments'
  )

  t.deepEquals(
    getSpyCalls(onErrorSpy).length,
    0,
    'should call onError'
  )

  unmockRequire()
})

test('npm:publishPackages: errors', async (t) => {
  const execaSpy = createSpy(() => Promise.reject({ stderr: 'npm ERR!' }))
  const onErrorSpy = createSpy(() => {})

  const packageJsons: any = {
    'packages/a': {
      auto: {
        npm: {
          registry: 'invalid',
          access: 'public',
          publishSubDirectory: '',
        },
      },
    },
    'packages/b': {
      auto: {
        npm: {
          registry: 'http://registry',
          access: 'invalid',
          publishSubDirectory: '',
        },
      },
    },
  }

  const unmockRequire = mockRequire('../../src/npm/publish-packages', {
    execa: { default: execaSpy },
    '../../src/fs/read-package': {
      readPackage: (dir: string) => Promise.resolve(packageJsons[dir]),
    },
    '../../src/npm/log-error': {
      logError: onErrorSpy,
    },
  })

  const { publishPackages } = await import('../../src/npm/publish-packages')

  await publishPackages({
    onError: onErrorSpy,
  })({
    config: {},
    packages: [{
      name: 'a',
      version: '0.0.1',
      type: 'patch',
      dir: 'packages/a',
      json: {
        name: 'a',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    }, {
      name: 'b',
      version: '0.0.1',
      type: 'patch',
      dir: 'packages/b',
      json: {
        name: 'b',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    }],
    prefixes,
  })

  await publishPackages()({
    config: {},
    prefixes,
    packages: [
      {
        name: 'a',
        version: '0.0.1',
        type: 'patch',
        dir: 'packages/a',
        json: {
          name: 'a',
          version: '0.0.1',
        },
        deps: null,
        devDeps: null,
        messages: null,
      },
    ],
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'invalid', '--access', 'public', 'packages/a']],
      ['npm', ['publish', '--registry', 'http://registry', '--access', 'invalid', 'packages/b']],
      ['npm', ['publish', '--registry', 'invalid', '--access', 'public', 'packages/a']],
    ],
    'should spawn NPM with necessary arguments'
  )

  t.deepEquals(
    getSpyCalls(onErrorSpy),
    [
      ['npm ERR!'],
      ['npm ERR!'],
      ['npm ERR!'],
    ],
    'should call onError'
  )

  unmockRequire()
})

test('npm:publishPackages: other errors', async (t) => {
  const execaSpy = createSpy(() => Promise.reject({ stderr: 'other error' }))
  const onErrorSpy = createSpy(() => {})

  const packageJsons: any = {
    'packages/a': {
      auto: {
        npm: {
          registry: 'invalid',
          access: 'public',
          publishSubDirectory: '',
        },
      },
    },
    'packages/b': {
      auto: {
        npm: {
          registry: 'http://registry',
          access: 'invalid',
          publishSubDirectory: '',
        },
      },
    },
  }

  const unmockRequire = mockRequire('../../src/npm/publish-packages', {
    execa: { default: execaSpy },
    '../../src/fs/read-package': {
      readPackage: (dir: string) => Promise.resolve(packageJsons[dir]),
    },
    '../../src/npm/log-error': {
      logError: onErrorSpy,
    },
  })

  const { publishPackages } = await import('../../src/npm/publish-packages')

  await publishPackages({
    onError: onErrorSpy,
  })({
    config: {},
    packages: [{
      name: 'a',
      version: '0.0.1',
      type: 'patch',
      dir: 'packages/a',
      json: {
        name: 'a',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    }, {
      name: 'b',
      version: '0.0.1',
      type: 'patch',
      dir: 'packages/b',
      json: {
        name: 'b',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    }],
    prefixes,
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'invalid', '--access', 'public', 'packages/a']],
      ['npm', ['publish', '--registry', 'http://registry', '--access', 'invalid', 'packages/b']],
    ],
    'should spawn NPM with necessary arguments'
  )

  t.deepEquals(
    getSpyCalls(onErrorSpy),
    [],
    'should call onError'
  )

  unmockRequire()
})
