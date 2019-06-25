import test from 'blue-tape'
import { mock, unmock, deleteFromCache } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

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

  mock('../src/get-packages', {
    fs,
    'graceful-fs': fs,
  })
  deleteFromCache('fast-glob')

  const { getPackages } = await import('../src/get-packages')
  t.deepEquals(
    await getPackages(),
    {
      '@ns/a': {
        dir: `${rootDir}/fakes/a`,
        json: {
          name: '@ns/a',
          version: '1.0.0',
        },
      },
      b: {
        dir: `${rootDir}/fakes/b`,
        json: {
          name: 'b',
          version: '2.0.0',
        },
      },
      '@ns/c': {
        dir: `${rootDir}/fakes/c`,
        json: {
          name: '@ns/c',
          version: '3.0.0',
        },
      },
    },
    'should return packages'
  )

  unmock('../src/get-packages')
})
