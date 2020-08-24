/* eslint-disable node/no-sync */
import { promisify } from 'util'
import { mockRequire } from '@mock/require'
import { createFsFromVolume, Volume } from 'memfs'
import test from 'tape'

const rootDir = process.cwd()

test('fs:writePackageVersion: single version bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
    }),
    [`${rootDir}/fakes/b/package.json`]: JSON.stringify({
      name: '@ns/b',
      version: '0.0.1',
    }),
    [`${rootDir}/fakes/c/package.json`]: JSON.stringify({
      name: '@ns/c',
      version: '0.1.0',
    }),
  })
  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../../src/fs/write-packages-versions', {
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })

  const { writePackagesVersions } = await import('../../src/fs/write-packages-versions')

  await writePackagesVersions([
    {
      dir: `${rootDir}/fakes/a`,
      version: '1.0.1',
    },
    {
      dir: `${rootDir}/fakes/b`,
      version: '0.1.0',
    },
    {
      dir: `${rootDir}/fakes/c`,
      version: null,
    },
  ])

  const aData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const bData = fs.readFileSync(`${rootDir}/fakes/b/package.json`, 'utf8') as string
  const cData = fs.readFileSync(`${rootDir}/fakes/c/package.json`, 'utf8') as string

  t.deepEquals(
    JSON.parse(aData),
    {
      name: '@ns/a',
      version: '1.0.1',
    },
    'should write bumps'
  )

  t.deepEquals(
    JSON.parse(bData),
    {
      name: '@ns/b',
      version: '0.1.0',
    },
    'should write bumps'
  )

  t.deepEquals(
    JSON.parse(cData),
    {
      name: '@ns/c',
      version: '0.1.0',
    },
    'should not write bumps'
  )

  unmockRequire()
})
