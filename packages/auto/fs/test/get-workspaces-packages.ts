import test from 'blue-tape'
import { mock, unmock, deleteFromCache } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'
import { TWorkspacesOptions } from '@auto/utils'

const options: TWorkspacesOptions = {
  autoNamePrefix: '@',
}
const rootDir = process.cwd()

test('fs:getWorkspacesPackages workspaces[]', async (t) => {
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

  mock('../src/get-workspaces-packages', {
    fs,
    'graceful-fs': fs,
  })
  deleteFromCache('fast-glob')

  const { getWorkspacesPackages } = await import('../src/get-workspaces-packages')
  t.deepEquals(
    await getWorkspacesPackages(options),
    {
      'ns/a': {
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
      'ns/c': {
        dir: `${rootDir}/fakes/c`,
        json: {
          name: '@ns/c',
          version: '3.0.0',
        },
      },
    },
    'should return packages'
  )

  unmock('../src/get-workspaces-packages')
})
