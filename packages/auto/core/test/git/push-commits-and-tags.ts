import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { prefixes } from '../prefixes'

test('git:pushCommitsAndTags', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/git/push-commits-and-tags', {
    execa: { default: execaSpy },
  })

  const { pushCommitsAndTags } = await import('../../src/git/push-commits-and-tags')

  await pushCommitsAndTags()({
    config: {},
    packages: [],
    prefixes,
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['push', '--quiet', '--follow-tags']],
    ],
    'should push'
  )

  unmockRequire()
})
