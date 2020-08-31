import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { prefixes } from '../prefixes'

test('npm:publishPackages: normal usecases', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const messageSpy = createSpy(() => {})
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
    prompts: {
      default: () => Promise.resolve({ value: 'YES' }),
    },
    '../../src/fs/read-package': {
      readPackage: (dir: string) => Promise.resolve(packageJsons[dir]),
    },
    '../../src/npm/log': {
      logMessage: messageSpy,
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
    }, {
      name: 'c',
      version: null,
      type: null,
      dir: 'packages/c',
      json: {
        name: 'c',
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
    getSpyCalls(messageSpy),
    [],
    'should not call logMessage'
  )

  t.deepEquals(
    getSpyCalls(errorSpy),
    [],
    'should not call logError'
  )

  unmockRequire()
})

test('npm:publishPackages: registry override', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const messageSpy = createSpy(() => {})
  const errorSpy = createSpy(() => {})

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
    execa: {
      default: execaSpy,
    },
    prompts: {
      default: () => Promise.resolve({ value: 'YES' }),
    },
    '../../src/fs/read-package': {
      readPackage: (dir: string) => Promise.resolve(packageJsons[dir]),
    },
    '../../src/npm/log': {
      logMessage: () => {},
      logError: () => {},
    },
  })

  const { publishPackages } = await import('../../src/npm/publish-packages')

  await publishPackages({
    registry: 'https://override',
    logMessage: messageSpy,
    logError: errorSpy,
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
    getSpyCalls(messageSpy),
    [],
    'should not call logMessage'
  )

  t.deepEquals(
    getSpyCalls(errorSpy),
    [],
    'should not call logError'
  )

  unmockRequire()
})

test('npm:publishPackages: npm errors', async (t) => {
  const execaSpy = createSpy(({ index }) => (
    index % 2 === 0
      ? Promise.reject({ stderr: '403 Forbidden: You cannot do this' })
      : Promise.resolve()
  ))
  const promptsSpy = createSpy(() => Promise.reject())
  const messageSpy = createSpy(() => {})
  const errorSpy = createSpy(() => {})

  const packageJsons: any = {
    'packages/a': {},
    'packages/b': {},
  }

  const unmockRequire = mockRequire('../../src/npm/publish-packages', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
    '../../src/fs/read-package': {
      readPackage: (dir: string) => Promise.resolve(packageJsons[dir]),
    },
    '../../src/npm/log.ts': {
      logMessage: messageSpy,
      logError: errorSpy,
    },
  })

  const { publishPackages } = await import('../../src/npm/publish-packages')

  await publishPackages({
    logMessage: messageSpy,
    logError: errorSpy,
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
      ['npm', ['publish', '--registry', 'https://registry.npmjs.org/', '--access', 'restricted', 'packages/a']],
      ['npm', ['publish', '--registry', 'https://registry.npmjs.org/', '--access', 'restricted', 'packages/b']],
    ],
    'should spawn NPM with necessary arguments'
  )

  t.deepEquals(
    getSpyCalls(promptsSpy).length,
    0,
    'should call prompts'
  )

  t.deepEquals(
    getSpyCalls(messageSpy),
    [
      ['Package "a@0.0.1" has already been published'],
    ],
    'should not call logMessage'
  )

  t.deepEquals(
    getSpyCalls(errorSpy),
    [],
    'should call onError'
  )

  unmockRequire()
})

test('npm:publishPackages: npm errors', async (t) => {
  const execaSpy = createSpy(({ index }) => (
    index % 2 === 0
      ? Promise.reject({ stderr: 'npm ERR!' })
      : Promise.resolve()
  ))
  const promptsSpy = createSpy(() => Promise.resolve({ value: 'YES' }))
  const messageSpy = createSpy(() => {})
  const errorSpy = createSpy(() => {})

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
    prompts: { default: promptsSpy },
    '../../src/fs/read-package': {
      readPackage: (dir: string) => Promise.resolve(packageJsons[dir]),
    },
    '../../src/npm/log.ts': {
      logMessage: messageSpy,
      logError: errorSpy,
    },
  })

  const { publishPackages } = await import('../../src/npm/publish-packages')

  await publishPackages({
    logMessage: messageSpy,
    logError: errorSpy,
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
      ['npm', ['publish', '--registry', 'invalid', '--access', 'public', 'packages/a']],
      ['npm', ['publish', '--registry', 'http://registry', '--access', 'invalid', 'packages/b']],
      ['npm', ['publish', '--registry', 'http://registry', '--access', 'invalid', 'packages/b']],
      ['npm', ['publish', '--registry', 'invalid', '--access', 'public', 'packages/a']],
      ['npm', ['publish', '--registry', 'invalid', '--access', 'public', 'packages/a']],
    ],
    'should spawn NPM with necessary arguments'
  )

  t.deepEquals(
    getSpyCalls(promptsSpy).length,
    3,
    'should call prompts'
  )

  t.deepEquals(
    getSpyCalls(messageSpy),
    [],
    'should not call logMessage'
  )

  t.deepEquals(
    getSpyCalls(errorSpy),
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
  const execaSpy = createSpy(({ index }) => (
    index % 2 === 0
      ? Promise.reject({ stderr: 'other error' })
      : Promise.resolve()
  ))
  const promptsSpy = createSpy(() => Promise.resolve({ value: 'YES' }))
  const messageSpy = createSpy(() => {})
  const errorSpy = createSpy(() => {})

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
    prompts: { default: promptsSpy },
    '../../src/fs/read-package': {
      readPackage: (dir: string) => Promise.resolve(packageJsons[dir]),
    },
    '../../src/npm/log.ts': {
      logMessage: messageSpy,
      logError: errorSpy,
    },
  })

  const { publishPackages } = await import('../../src/npm/publish-packages')

  await publishPackages({
    logError: errorSpy,
    logMessage: messageSpy,
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
      ['npm', ['publish', '--registry', 'invalid', '--access', 'public', 'packages/a']],
      ['npm', ['publish', '--registry', 'http://registry', '--access', 'invalid', 'packages/b']],
      ['npm', ['publish', '--registry', 'http://registry', '--access', 'invalid', 'packages/b']],
    ],
    'should spawn NPM with necessary arguments'
  )

  t.deepEquals(
    getSpyCalls(messageSpy),
    [],
    'should call logMessage'
  )

  t.deepEquals(
    getSpyCalls(errorSpy),
    [
      ['other error'],
      ['other error'],
    ],
    'should call onError'
  )

  unmockRequire()
})
