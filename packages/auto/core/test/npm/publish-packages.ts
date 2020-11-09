import { mockRequire } from '@mock/require'
import { SpawnError } from 'spown'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { prefixes } from '../prefixes'

test('npm:publishPackages: normal usecases', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
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
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
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
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'npm publish --registry https://a_reg --access restricted packages/a/build',
        { stdin: process.stdin, stdout: process.stdout },
      ],
      [
        'npm publish --registry http://global --access public packages/b/dist',
        { stdin: process.stdin, stdout: process.stdout },
      ],
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
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
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
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
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
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'npm publish --registry https://override --access restricted packages/a/build',
        { stdin: process.stdin, stdout: process.stdout },
      ],
      [
        'npm publish --registry https://override --access public packages/b/dist',
        { stdin: process.stdin, stdout: process.stdout },
      ],
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
  const spawnChildProcessSpy = createSpy(({ index }) => (
    index % 2 === 0
      ? Promise.reject(new SpawnError(`
npm ERR! code E403
npm ERR! 403 403 Forbidden - PUT - You cannot publish over the previously published versions.
npm ERR! 403 In most cases, you or one of your dependencies are requesting
npm ERR! 403 a package version that is forbidden by your security policy.
`, 42))
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
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
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
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'npm publish --registry https://registry.npmjs.org/ --access restricted packages/a',
        { stdin: process.stdin, stdout: process.stdout },
      ],
      [
        'npm publish --registry https://registry.npmjs.org/ --access restricted packages/b',
        { stdin: process.stdin, stdout: process.stdout },
      ],
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
  const spawnChildProcessSpy = createSpy(({ index }) => (
    index % 2 === 0
      ? Promise.reject(new SpawnError('npm ERR!', 42))
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
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
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
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'npm publish --registry invalid --access public packages/a',
        { stdin: process.stdin, stdout: process.stdout },
      ],
      [
        'npm publish --registry invalid --access public packages/a',
        { stdin: process.stdin, stdout: process.stdout },
      ],
      [
        'npm publish --registry http://registry --access invalid packages/b',
        { stdin: process.stdin, stdout: process.stdout },
      ],
      [
        'npm publish --registry http://registry --access invalid packages/b',
        { stdin: process.stdin, stdout: process.stdout },
      ],
      [
        'npm publish --registry invalid --access public packages/a',
        { stdin: process.stdin, stdout: process.stdout },
      ],
      [
        'npm publish --registry invalid --access public packages/a',
        { stdin: process.stdin, stdout: process.stdout },
      ],
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
  const spawnChildProcessSpy = createSpy(({ index }) => (
    index % 2 === 0
      ? Promise.reject(new SpawnError('other error', 42))
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
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
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
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'npm publish --registry invalid --access public packages/a',
        { stdin: process.stdin, stdout: process.stdout },
      ],
      [
        'npm publish --registry invalid --access public packages/a',
        { stdin: process.stdin, stdout: process.stdout },
      ],
      [
        'npm publish --registry http://registry --access invalid packages/b',
        { stdin: process.stdin, stdout: process.stdout },
      ],
      [
        'npm publish --registry http://registry --access invalid packages/b',
        { stdin: process.stdin, stdout: process.stdout },
      ],
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
