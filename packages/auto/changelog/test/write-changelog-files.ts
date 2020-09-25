/* eslint-disable node/no-sync */
import { promisify } from 'util'
import type { TPackageRelease, TAutoConfig } from '@auto/core'
import { mockRequire } from '@mock/require'
import { createFsFromVolume, Volume } from 'memfs'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { prefixes } from './prefixes'

const rootDir = process.cwd()

const config: TAutoConfig = {
  prefixes,
}

test('writeChangelogFiles', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '0.1.0',
    }),
    [`${rootDir}/fakes/a/changelog.md`]: `## v0.1.0\n\n* 🐞 patch\n`,
    [`${rootDir}/fakes/b/package.json`]: JSON.stringify({
      name: 'b',
      version: '0.0.1',
    }),
    [`${rootDir}/fakes/c/package.json`]: JSON.stringify({
      name: 'c',
      version: '0.0.1',
    }),
    [`${rootDir}/fakes/c/changelog.md`]: `## v0.1.0\n\n* 🐞 patch\n`,
    [`${rootDir}/fakes/d/package.json`]: JSON.stringify({
      name: 'd',
      version: '0.0.1',
    }),
  })
  const fs = createFsFromVolume(vol)

  const spawnChildProcessaSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../src/write-changelog-files', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
    spown: {
      spawnChildProcess: spawnChildProcessaSpy,
    },
  })

  const { writeChangelogFiles } = await import('../src/write-changelog-files')

  const packages: TPackageRelease[] = [
    {
      name: 'ns/a',
      dir: `${rootDir}/fakes/a`,
      json: {
        name: '@ns/a',
        version: '0.1.0',
      },
      version: '0.2.0',
      type: 'minor',
      deps: null,
      devDeps: null,
      messages: [
        {
          type: 'minor',
          message: 'minor commit',
        },
        {
          type: 'patch',
          message: 'patch commit',
          description: 'patch description',
        },
      ],
    },
    {
      name: 'b',
      dir: `${rootDir}/fakes/b`,
      json: {
        name: 'b',
        version: '0.0.0',
      },
      version: '0.1.0',
      type: 'initial',
      deps: {
        '@ns/a': '^0.2.0',
      },
      devDeps: null,
      messages: [
        {
          type: 'initial',
          message: 'initial commit',
          description: 'initial description',
        },
      ],
    },
    {
      name: 'c',
      dir: `${rootDir}/fakes/c`,
      json: {
        name: 'c',
        version: '1.0.0',
      },
      version: '1.1.0',
      type: 'minor',
      deps: {
        '@ns/a': '^0.1.0',
        b: '^0.1.0',
      },
      devDeps: null,
      messages: null,
    },
    {
      name: 'd',
      dir: `${rootDir}/fakes/d`,
      json: {
        name: 'd',
        version: '1.0.0',
      },
      version: null,
      type: null,
      deps: null,
      devDeps: {
        b: '^0.1.0',
      },
      messages: null,
    },
  ]

  await writeChangelogFiles({
    config,
    prefixes,
    packages,
  })

  t.equals(
    fs.readFileSync(`${rootDir}/fakes/a/changelog.md`, 'utf-8'),
    '## v0.2.0\n\n* 🌱 minor commit\n\n* 🐞 patch commit\n\n  ```\n  patch description\n  ```\n\n## v0.1.0\n\n* 🐞 patch\n',
    'should write changelog'
  )

  t.equals(
    fs.readFileSync(`${rootDir}/fakes/b/changelog.md`, 'utf-8'),
    '## v0.1.0\n\n* 🐣️ initial commit\n\n  ```\n  initial description\n  ```\n',
    'should write changelog'
  )

  t.equals(
    fs.readFileSync(`${rootDir}/fakes/c/changelog.md`, 'utf-8'),
    '## v1.1.0\n\n* ♻️ update dependencies `@ns/a`\n\n## v0.1.0\n\n* 🐞 patch\n',
    'should write changelog'
  )

  t.deepEqual(
    getSpyCalls(spawnChildProcessaSpy),
    [
      [`git add ${rootDir}/fakes/a/changelog.md`, { stdout: null, stderr: process.stderr }],
      [`git add ${rootDir}/fakes/b/changelog.md`, { stdout: null, stderr: process.stderr }],
      [`git add ${rootDir}/fakes/c/changelog.md`, { stdout: null, stderr: process.stderr }],
    ],
    'should stage new changelog files to Git'
  )

  try {
    fs.readFileSync(`${rootDir}/fakes/d/changelog.md`, 'utf-8')

    t.fail('should not get here')
  } catch {
  }

  unmockRequire()
})
