import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'

test('git:getCommitMessages', async (t) => {
  const commitMessages = `---🐣 some-package-2: init

p1 l1
p1 l2

p2 l1
p2 l2

---📦 some-package-1: release

---🛠 fix
`

  const spawnChildProcessSpy = createSpy(() => Promise.resolve({
    stdout: commitMessages,
  }))

  const unmockRequire = mockRequire('../../src/git/get-commit-messages', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
  })

  const { getCommitMessages } = await import('../../src/git/get-commit-messages')

  t.deepEquals(
    await getCommitMessages(),
    [
      '🐣 some-package-2: init\n\np1 l1\np1 l2\n\np2 l1\np2 l2',
      '📦 some-package-1: release',
      '🛠 fix',
    ],
    'return commit messages'
  )

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['git log --no-merges --format=---%B', { stderr: process.stderr }],
    ],
    'should spawn git with arguments'
  )

  unmockRequire()
})
