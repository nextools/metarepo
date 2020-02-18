import test from 'blue-tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

test('git:getCommitMessages', async (t) => {
  const commitMessages = `---🐣 some-package-2: init

p1 l1
p1 l2

p2 l1
p2 l2

---📦 some-package-1: release

---🛠 fix
`

  const execaSpy = createSpy(() => Promise.resolve({
    stdout: commitMessages,
  }))

  const unmock = mock('../src/get-commit-messages', {
    execa: { default: execaSpy },
  })

  const { getCommitMessages } = await import('../src/get-commit-messages')

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
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['log', '--no-merges', '--format=---%B']],
    ],
    'should spawn git with arguments'
  )

  unmock()
})
