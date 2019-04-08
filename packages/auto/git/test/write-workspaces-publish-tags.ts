import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

test('git:writeWorkspacesPublishTag: multiple tags', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-publish-tags', {
    execa: { default: execaSpy },
  })

  const { writeWorkspacesPublishTags } = await import('../src/write-workspaces-publish-tags')

  await writeWorkspacesPublishTags([
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

  unmock('../src/write-workspaces-publish-tags')
})

test('git:writeWorkspacesPublishTag: no tags', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-publish-tags', {
    execa: { default: execaSpy },
  })

  const { writeWorkspacesPublishTags } = await import('../src/write-workspaces-publish-tags')

  await writeWorkspacesPublishTags([
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

  unmock('../src/write-workspaces-publish-tags')
})
