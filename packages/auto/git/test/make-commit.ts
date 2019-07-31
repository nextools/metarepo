import test from 'blue-tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { prefixes } from '@auto/utils/test/prefixes'

test('git:makeCommit single package', async (t) => {
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

  const unmock = mock('../src/make-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit(
    {
      foo: {
        dir: 'fakes/foo',
        json: {
          name: '@ns/foo',
          version: '1.2.3',
        },
      },
    },
    prefixes,
    { autoNamePrefix: '@' }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix foo: message']],
    ],
    'should write proper message'
  )

  unmock()
})

test('git:makeCommit multiple packages', async (t) => {
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

  const unmock = mock('../src/make-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit(
    {
      foo: {
        dir: 'fakes/foo',
        json: {
          name: '@ns/foo',
          version: '1.2.3',
        },
      },
    },
    prefixes,
    { autoNamePrefix: '@' }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix foo, bar*, *: message']],
    ],
    'should write proper message'
  )

  unmock()
})

test('git:makeCommit: no auto name prefix in prefixes', async (t) => {
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

  const unmock = mock('../src/make-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit(
    {
      foo: {
        dir: 'fakes/foo',
        json: {
          name: '@ns/foo',
          version: '1.2.3',
        },
      },
    },
    prefixes,
    { autoNamePrefix: '@' }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix foo: message']],
    ],
    'should write proper message'
  )

  unmock()
})

test('git:makeCommit: no package name', async (t) => {
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

  const unmock = mock('../src/make-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit(
    {
      foo: {
        dir: 'fakes/foo',
        json: {
          name: '@ns/foo',
          version: '1.2.3',
        },
      },
    },
    prefixes,
    { autoNamePrefix: '@' }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix message']],
    ],
    'should write proper message'
  )

  unmock()
})

test('git:makeCommit: all packages `*`', async (t) => {
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

  const unmock = mock('../src/make-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit(
    {
      foo: {
        dir: 'fakes/foo',
        json: {
          name: '@ns/foo',
          version: '1.2.3',
        },
      },
    },
    prefixes,
    { autoNamePrefix: '@' }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix *: message']],
    ],
    'should write proper message'
  )

  unmock()
})

test('git:makeCommit: should throw on prefix undefined', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(() => Promise.resolve({}))

  const unmock = mock('../src/make-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeCommit } = await import('../src/make-commit')

  try {
    await makeCommit(
      {
        foo: {
          dir: 'fakes/foo',
          json: {
            name: '@ns/foo',
            version: '1.2.3',
          },
        },
      },
      prefixes,
      { autoNamePrefix: '@' }
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Change type is required')
  }

  unmock()
})

test('git:makeCommit: should throw on packageName undefined', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    return Promise.resolve({})
  })

  const unmock = mock('../src/make-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeCommit } = await import('../src/make-commit')

  try {
    await makeCommit(
      {
        foo: {
          dir: 'fakes/foo',
          json: {
            name: '@ns/foo',
            version: '1.2.3',
          },
        },
      },
      prefixes,
      { autoNamePrefix: '@' }
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Package name is required')
  }

  unmock()
})

test('git:makeCommit: should throw on message undefined', async (t) => {
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

  const unmock = mock('../src/make-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeCommit } = await import('../src/make-commit')

  try {
    await makeCommit(
      {
        foo: {
          dir: 'fakes/foo',
          json: {
            name: '@ns/foo',
            version: '1.2.3',
          },
        },
      },
      prefixes,
      { autoNamePrefix: '@' }
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Commit message is required')
  }

  unmock()
})

test('git:makeCommit lowercase first message letter', async (t) => {
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

  const unmock = mock('../src/make-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeCommit } = await import('../src/make-commit')

  await makeCommit(
    {
      foo: {
        dir: 'fakes/foo',
        json: {
          name: '@ns/foo',
          version: '1.2.3',
        },
      },
    },
    prefixes,
    { autoNamePrefix: '@' }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix foo: my Message']],
    ],
    'should write proper message'
  )

  unmock()
})
