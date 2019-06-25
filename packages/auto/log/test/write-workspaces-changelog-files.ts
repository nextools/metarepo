/* eslint-disable no-sync */
import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'
import { prefixes } from '@auto/utils/test/prefixes'

const rootDir = process.cwd()

test('writeWorkspacesChangelogFiles', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
    }),
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-workspaces-changelog-files', {
    'graceful-fs': fs,
  })

  const { writeWorkspacesChangelogFiles } = await import('../src/write-workspaces-changelog-files')

  await writeWorkspacesChangelogFiles(
    [
      {
        name: '@ns/a',
        version: '0.1.0',
        type: 'minor',
        dir: 'fakes/a',
        messages: [
          {
            type: 'minor',
            value: 'minor',
          },
          {
            type: 'patch',
            value: 'patch',
          },
        ],
      },
    ],
    prefixes
  )

  let changelogData = fs.readFileSync(`${rootDir}/fakes/a/changelog.md`, 'utf8') as string

  t.equal(
    changelogData,
    '## v0.1.0\n\n* 🌱 minor\n* 🐞 patch\n',
    'should write a new changelog.md'
  )

  await writeWorkspacesChangelogFiles(
    [
      {
        name: '@ns/a',
        version: '0.2.0',
        type: 'minor',
        dir: 'fakes/a',
        messages: [
          {
            type: 'minor',
            value: 'minor',
          },
        ],
      },
    ],
    prefixes
  )

  changelogData = fs.readFileSync(`${rootDir}/fakes/a/changelog.md`, 'utf8') as string

  t.equal(
    changelogData,
    '## v0.2.0\n\n* 🌱 minor\n\n## v0.1.0\n\n* 🌱 minor\n* 🐞 patch\n',
    'should prepend to an already existing changelog.md'
  )

  unmock('../src/write-workspaces-changelog-files')
})
