import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

test('git:writeWorkspacesPublishTag: single package', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-publish-tag', {
    execa: { default: execaSpy },
  })

  const { writeWorkspacesPublishTag } = await import('../src/write-workspaces-publish-tag')

  await writeWorkspacesPublishTag(
    {
      name: 'a',
      dir: 'fakes/a',
      type: 'patch',
      version: '0.1.1',
      deps: null,
      devDeps: null,
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['tag', '-m', 'a@0.1.1', 'a@0.1.1']],
    ],
    'single package'
  )

  unmock('../src/write-workspaces-publish-tag')
})

test('git:writeWorkspacesPublishTag: no packages to publish', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-publish-tag', {
    execa: { default: execaSpy },
  })

  const { writeWorkspacesPublishTag } = await import('../src/write-workspaces-publish-tag')

  await writeWorkspacesPublishTag(
    {
      name: 'a',
      dir: 'fakes/a',
      type: null,
      version: null,
      deps: {
        b: '~0.2.0',
      },
      devDeps: null,
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy),
    [],
    'no packages to publish'
  )

  unmock('../src/write-workspaces-publish-tag')
})
