import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { prefixes } from '../prefixes'

test('git:pushCommitsAndTags', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/git/push-commits-and-tags', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
  })

  const { pushCommitsAndTags } = await import('../../src/git/push-commits-and-tags')

  await pushCommitsAndTags()({
    config: {},
    packages: [],
    prefixes,
  })

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['git push --quiet --follow-tags', { stdout: null, stderr: process.stderr }],
    ],
    'should push'
  )

  unmockRequire()
})
