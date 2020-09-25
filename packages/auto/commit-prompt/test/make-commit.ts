import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { prefixes } from './prefixes'

test('git:makeCommit single package', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: 'foo' })
    }

    if (index === 2) {
      return Promise.resolve({ packageName: '-' })
    }

    return Promise.resolve({ message: 'message' })
  })

  const unmockRequire = mockRequire('../src/make-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    prompts: { default: promptsSpy },
    '@auto/core': {
      getPackages: () => Promise.resolve(
        new Map()
          .set('foo', {
            dir: 'fakes/foo',
            json: {
              name: '@ns/foo',
              version: '1.2.3',
            },
          })
      ),
    },
    '../src/get-refixes': {
      getPrefixes: () => Promise.resolve(prefixes),
    },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit()

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['git commit -m "prefix foo: message"', { stdout: null, stderr: process.stderr }],
    ],
    'should write proper message'
  )

  unmockRequire()
})

test('git:makeCommit multiple packages', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: 'foo' })
    }

    if (index === 2) {
      return Promise.resolve({ packageName: 'bar*' })
    }

    if (index === 3) {
      return Promise.resolve({ packageName: '*' })
    }

    return Promise.resolve({ message: 'message' })
  })

  const unmockRequire = mockRequire('../src/make-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    prompts: { default: promptsSpy },
    '@auto/core': {
      getPackages: () => Promise.resolve(
        new Map()
          .set('foo', {
            dir: 'fakes/foo',
            json: {
              name: '@ns/foo',
              version: '1.2.3',
            },
          })
      ),
    },
    '../src/get-refixes': {
      getPrefixes: () => Promise.resolve(prefixes),
    },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit()

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['git commit -m "prefix foo, bar*, *: message"', { stdout: null, stderr: process.stderr }],
    ],
    'should write proper message'
  )

  unmockRequire()
})

test('git:makeCommit: no auto name prefix in prefixes', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: 'foo' })
    }

    if (index === 2) {
      return Promise.resolve({ packageName: '-' })
    }

    return Promise.resolve({ message: 'message' })
  })

  const unmockRequire = mockRequire('../src/make-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    prompts: { default: promptsSpy },
    '@auto/core': {
      getPackages: () => Promise.resolve(
        new Map()
          .set('foo', {
            dir: 'fakes/foo',
            json: {
              name: '@ns/foo',
              version: '1.2.3',
            },
          })
      ),
    },
    '../src/get-refixes': {
      getPrefixes: () => Promise.resolve(prefixes),
    },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit()

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['git commit -m "prefix foo: message"', { stdout: null, stderr: process.stderr }],
    ],
    'should write proper message'
  )

  unmockRequire()
})

test('git:makeCommit: no package name', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: '-' })
    }

    return Promise.resolve({ message: 'message' })
  })

  const unmockRequire = mockRequire('../src/make-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    prompts: { default: promptsSpy },
    '@auto/core': {
      getPackages: () => Promise.resolve(
        new Map()
          .set('foo', {
            dir: 'fakes/foo',
            json: {
              name: '@ns/foo',
              version: '1.2.3',
            },
          })
      ),
    },
    '../src/get-refixes': {
      getPrefixes: () => Promise.resolve(prefixes),
    },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit()

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['git commit -m "prefix message"', { stdout: null, stderr: process.stderr }],
    ],
    'should write proper message'
  )

  unmockRequire()
})

test('git:makeCommit: all packages `*`', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: '*' })
    }

    return Promise.resolve({ message: 'message' })
  })

  const unmockRequire = mockRequire('../src/make-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    prompts: { default: promptsSpy },
    '@auto/core': {
      getPackages: () => Promise.resolve(
        new Map()
          .set('foo', {
            dir: 'fakes/foo',
            json: {
              name: '@ns/foo',
              version: '1.2.3',
            },
          })
      ),
    },
    '../src/get-refixes': {
      getPrefixes: () => Promise.resolve(prefixes),
    },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit()

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['git commit -m "prefix *: message"', { stdout: null, stderr: process.stderr }],
    ],
    'should write proper message'
  )

  unmockRequire()
})

test('git:makeCommit: should throw on prefix undefined', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(() => Promise.resolve({}))

  const unmockRequire = mockRequire('../src/make-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    prompts: { default: promptsSpy },
    '@auto/core': {
      getPackages: () => Promise.resolve(
        new Map()
          .set('foo', {
            dir: 'fakes/foo',
            json: {
              name: '@ns/foo',
              version: '1.2.3',
            },
          })
      ),
    },
    '../src/get-refixes': {
      getPrefixes: () => Promise.resolve(prefixes),
    },
  })

  const { makeCommit } = await import('../src/make-commit')

  try {
    await makeCommit()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Change type is required')
  }

  unmockRequire()
})

test('git:makeCommit: should throw on packageName undefined', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    return Promise.resolve({})
  })

  const unmockRequire = mockRequire('../src/make-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    prompts: { default: promptsSpy },
    '@auto/core': {
      getPackages: () => Promise.resolve(
        new Map()
          .set('foo', {
            dir: 'fakes/foo',
            json: {
              name: '@ns/foo',
              version: '1.2.3',
            },
          })
      ),
    },
    '../src/get-refixes': {
      getPrefixes: () => Promise.resolve(prefixes),
    },
  })

  const { makeCommit } = await import('../src/make-commit')

  try {
    await makeCommit()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Package name is required')
  }

  unmockRequire()
})

test('git:makeCommit: should throw on message undefined', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: 'foo' })
    }

    if (index === 2) {
      return Promise.resolve({ packageName: '-' })
    }

    return Promise.resolve({})
  })

  const unmockRequire = mockRequire('../src/make-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    prompts: { default: promptsSpy },
    '@auto/core': {
      getPackages: () => Promise.resolve(
        new Map()
          .set('foo', {
            dir: 'fakes/foo',
            json: {
              name: '@ns/foo',
              version: '1.2.3',
            },
          })
      ),
    },
    '../src/get-refixes': {
      getPrefixes: () => Promise.resolve(prefixes),
    },
  })

  const { makeCommit } = await import('../src/make-commit')

  try {
    await makeCommit()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Commit message is required')
  }

  unmockRequire()
})

test('git:makeCommit lowercase first message letter', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: 'foo' })
    }

    if (index === 2) {
      return Promise.resolve({ packageName: '-' })
    }

    return Promise.resolve({ message: 'My Message' })
  })

  const unmockRequire = mockRequire('../src/make-commit', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    prompts: { default: promptsSpy },
    '@auto/core': {
      getPackages: () => Promise.resolve(
        new Map()
          .set('foo', {
            dir: 'fakes/foo',
            json: {
              name: '@ns/foo',
              version: '1.2.3',
            },
          })
      ),
    },
    '../src/get-refixes': {
      getPrefixes: () => Promise.resolve(prefixes),
    },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit()

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['git commit -m "prefix foo: my Message"', { stdout: null, stderr: process.stderr }],
    ],
    'should write proper message'
  )

  unmockRequire()
})
