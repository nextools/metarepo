import test from 'tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { prefixes } from '../prefixes'

test('git:pushCommitsAndTags', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../../src/git/push-commits-and-tags', {
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
      ['git', ['push', '--follow-tags']],
    ],
    'should push'
  )

  unmock()
})
