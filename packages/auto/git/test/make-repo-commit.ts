import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { prefixes } from '../../utils/test/prefixes'

test('git:makeRepoCommit', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    return Promise.resolve({ message: 'message' })
  })

  mock('../src/make-repo-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeRepoCommit } = await import('../src/make-repo-commit')

  await makeRepoCommit(prefixes)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix message']],
    ],
    'should write proper message'
  )

  unmock('../src/make-repo-commit')
})

test('git:makeRepoCommit: should throw on prefix undefined', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(() => {
    return Promise.resolve({})
  })

  mock('../src/make-repo-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeRepoCommit } = await import('../src/make-repo-commit')

  try {
    await makeRepoCommit(prefixes)

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Change type is required')
  }

  unmock('../src/make-repo-commit')
})

test('git:makeRepoCommit: should throw on message undefined', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    return Promise.resolve({})
  })

  mock('../src/make-repo-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeRepoCommit } = await import('../src/make-repo-commit')

  try {
    await makeRepoCommit(prefixes)

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Commit message is required')
  }

  unmock('../src/make-repo-commit')
})

test('git:makeRepoCommit lowercase first letter in message', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    return Promise.resolve({ message: 'My Message' })
  })

  mock('../src/make-repo-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy },
  })

  const { makeRepoCommit } = await import('../src/make-repo-commit')

  await makeRepoCommit(prefixes)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix my Message']],
    ],
    'should write proper message'
  )

  unmock('../src/make-repo-commit')
})
