/* eslint-disable no-sync */
import { promisify } from 'util'
import test from 'blue-tape'
import { mock } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'
import { prefixes } from '@auto/utils/test/prefixes'

const rootDir = process.cwd()

test('writeChangelogFiles', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
    }),
    [`${rootDir}/fakes/a/changelog.md`]: '## v1.0.0\n\n* 💥 major\n',
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../src/write-changelog-files', {
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })

  const { writeChangelogFiles } = await import('../src/write-changelog-files')

  await writeChangelogFiles(
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
            description: 'description',
          },
          {
            type: 'patch',
            value: 'patch',
            description: 'description',
          },
        ],
      },
    ],
    prefixes
  )

  let changelogData = fs.readFileSync(`${rootDir}/fakes/a/changelog.md`, 'utf8') as string

  t.equal(
    changelogData,
    '## v0.1.0\n\n* 🌱 minor\n\n  ```\n  description\n  ```\n\n* 🐞 patch\n\n  ```\n  description\n  ```\n\n## v1.0.0\n\n* 💥 major\n',
    'should prepend to an already existing changelog.md'
  )

  fs.unlinkSync(`${rootDir}/fakes/a/changelog.md`)

  await writeChangelogFiles(
    [
      {
        name: '@ns/a',
        version: '0.2.1',
        type: 'patch',
        dir: 'fakes/a',
        messages: [
          {
            type: 'patch',
            value: 'patch',
          },
        ],
      },
    ],
    prefixes
  )

  changelogData = fs.readFileSync(`${rootDir}/fakes/a/changelog.md`, 'utf8') as string

  t.equal(
    changelogData,
    '## v0.2.1\n\n* 🐞 patch\n',
    'should write a new changelog.md'
  )

  unmock()
})
