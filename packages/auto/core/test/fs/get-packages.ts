import { promisify } from 'util'
import { mockRequire } from '@mock/require'
import { createFsFromVolume, Volume } from 'memfs'
import test from 'tape'
import type { TPackageMap } from '../../src/types'

const rootDir = process.cwd()

test('fs:getPackages workspaces[]', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      workspaces: ['fakes/*'],
    }),
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
    }),
    [`${rootDir}/fakes/b/package.json`]: JSON.stringify({
      name: 'b',
      version: '2.0.0',
    }),
    [`${rootDir}/fakes/c/package.json`]: JSON.stringify({
      name: '@ns/c',
      version: '3.0.0',
    }),
  })
  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../../src/fs/get-packages', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
    },
  })

  const { getPackages } = await import('../../src/fs/get-packages')

  const expectedResult: TPackageMap = new Map()
    .set('@ns/a', {
      dir: `${rootDir}/fakes/a`,
      json: {
        name: '@ns/a',
        version: '1.0.0',
      },
    })
    .set('b', {
      dir: `${rootDir}/fakes/b`,
      json: {
        name: 'b',
        version: '2.0.0',
      },
    })
    .set('@ns/c', {
      dir: `${rootDir}/fakes/c`,
      json: {
        name: '@ns/c',
        version: '3.0.0',
      },
    })

  t.deepEquals(
    await getPackages(),
    expectedResult,
    'should return packages'
  )

  unmockRequire()
})
