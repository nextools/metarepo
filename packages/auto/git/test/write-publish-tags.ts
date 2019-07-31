import test from 'blue-tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

test('git:writePublishTag: multiple tags', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/write-publish-tags', {
    execa: { default: execaSpy },
  })

  const { writePublishTags } = await import('../src/write-publish-tags')

  await writePublishTags([
    {
      name: '@ns/a',
      dir: 'fakes/a',
      type: 'patch',
      version: '0.1.1',
      deps: null,
      devDeps: null,
    },
    {
      name: 'b',
      dir: 'fakes/b',
      type: 'minor',
      version: '0.2.0',
      deps: null,
      devDeps: null,
    },
  ], { autoNamePrefix: '@' })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['tag', '-m', 'ns/a@0.1.1', 'ns/a@0.1.1']],
      ['git', ['tag', '-m', 'b@0.2.0', 'b@0.2.0']],
    ],
    'multiple tags'
  )

  unmock()
})

test('git:writePublishTag: no tags', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/write-publish-tags', {
    execa: { default: execaSpy },
  })

  const { writePublishTags } = await import('../src/write-publish-tags')

  await writePublishTags([
    {
      name: 'a',
      dir: 'fakes/a',
      type: null,
      version: '0.1.1',
      deps: null,
      devDeps: null,
    },
    {
      name: 'b',
      dir: 'fakes/b',
      type: 'minor',
      version: null,
      deps: null,
      devDeps: null,
    },
  ], { autoNamePrefix: '@' })

  t.deepEquals(
    getSpyCalls(execaSpy),
    [],
    'no tags'
  )

  unmock()
})
