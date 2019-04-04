import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { prefixes } from '@auto/utils/test/prefixes'

test('git:makeWorkspacesCommit single package', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
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

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  await makeWorkspacesCommit({
    foo: {
      dir: 'fakes/foo',
      json: {
        name: '@ns/foo',
        version: '1.2.3',
      },
    },
  }, prefixes)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix foo: message']],
    ],
    'should write proper message'
  )

  unmock('../src/make-workspaces-commit')
})

test('git:makeWorkspacesCommit multiple packages', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
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

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  await makeWorkspacesCommit({
    foo: {
      dir: 'fakes/foo',
      json: {
        name: '@ns/foo',
        version: '1.2.3',
      },
    },
  }, prefixes)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix foo, bar*, *: message']],
    ],
    'should write proper message'
  )

  unmock('../src/make-workspaces-commit')
})

test('git:makeWorkspacesCommit: no auto name prefix in prefixes', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
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

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  await makeWorkspacesCommit({
    foo: {
      dir: 'fakes/foo',
      json: {
        name: '@ns/foo',
        version: '1.2.3',
      },
    },
  }, prefixes)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix foo: message']],
    ],
    'should write proper message'
  )

  unmock('../src/make-workspaces-commit')
})

test('git:makeWorkspacesCommit: no package name', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: '-' })
    }

    return Promise.resolve({ message: 'message' })
  })

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  await makeWorkspacesCommit({
    foo: {
      dir: 'fakes/foo',
      json: {
        name: '@ns/foo',
        version: '1.2.3',
      },
    },
  }, prefixes)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix message']],
    ],
    'should write proper message'
  )

  unmock('../src/make-workspaces-commit')
})

test('git:makeWorkspacesCommit: all packages `*`', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: '*' })
    }

    return Promise.resolve({ message: 'message' })
  })

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  await makeWorkspacesCommit({
    foo: {
      dir: 'fakes/foo',
      json: {
        name: '@ns/foo',
        version: '1.2.3',
      },
    },
  }, prefixes)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix *: message']],
    ],
    'should write proper message'
  )

  unmock('../src/make-workspaces-commit')
})

test('git:makeWorkspacesCommit: should throw on prefix undefined', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(() => Promise.resolve({}))

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  try {
    await makeWorkspacesCommit({
      foo: {
        dir: 'fakes/foo',
        json: {
          name: '@ns/foo',
          version: '1.2.3',
        },
      },
    }, prefixes)

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Change type is required')
  }

  unmock('../src/make-workspaces-commit')
})

test('git:makeWorkspacesCommit: should throw on packageName undefined', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    return Promise.resolve({})
  })

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  try {
    await makeWorkspacesCommit({
      foo: {
        dir: 'fakes/foo',
        json: {
          name: '@ns/foo',
          version: '1.2.3',
        },
      },
    }, prefixes)

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Package name is required')
  }

  unmock('../src/make-workspaces-commit')
})

test('git:makeWorkspacesCommit: should throw on message undefined', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
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

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  try {
    await makeWorkspacesCommit({
      foo: {
        dir: 'fakes/foo',
        json: {
          name: '@ns/foo',
          version: '1.2.3',
        },
      },
    }, prefixes)

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Commit message is required')
  }

  unmock('../src/make-workspaces-commit')
})

test('git:makeWorkspacesCommit lowercase first message letter', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
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

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  await makeWorkspacesCommit({
    foo: {
      dir: 'fakes/foo',
      json: {
        name: '@ns/foo',
        version: '1.2.3',
      },
    },
  }, prefixes)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix foo: my Message']],
    ],
    'should write proper message'
  )

  unmock('../src/make-workspaces-commit')
})
