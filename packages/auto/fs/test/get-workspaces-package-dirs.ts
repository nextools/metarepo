import test from 'blue-tape'
import { mock, unmock, deleteFromCache } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()

test('fs:getWorkspacesPackageDirs workspaces[]', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      workspaces: ['fakes/*'],
    }),
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/readme.md`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)

  mock('../src/get-workspaces-package-dirs', {
    fs,
    'graceful-fs': fs,
  })
  deleteFromCache('fast-glob')

  const { getWorkspacesPackageDirs } = await import('../src/get-workspaces-package-dirs')
  t.deepEquals(
    await getWorkspacesPackageDirs(),
    [
      `${rootDir}/fakes/a`,
      `${rootDir}/fakes/c`,
    ],
    'should return packages directories'
  )

  unmock('../src/get-workspaces-package-dirs')
})

test('fs:getWorkspacesPackageDirs workspaces.packages[]', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      workspaces: {
        packages: ['fakes/*'],
      },
    }),
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/readme.md`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)

  mock('../src/get-workspaces-package-dirs', {
    fs,
    'graceful-fs': fs,
  })

  const { getWorkspacesPackageDirs } = await import('../src/get-workspaces-package-dirs')
  t.deepEquals(
    await getWorkspacesPackageDirs(),
    [
      `${rootDir}/fakes/a`,
      `${rootDir}/fakes/c`,
    ],
    'should return packages directories'
  )

  unmock('../src/get-workspaces-package-dirs')
})

test('fs:getWorkspacesPackageDirs no workspaces', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({}),
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/readme.md`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)

  mock('../src/get-workspaces-package-dirs', {
    fs,
    'graceful-fs': fs,
  })

  const { getWorkspacesPackageDirs } = await import('../src/get-workspaces-package-dirs')

  try {
    await getWorkspacesPackageDirs()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, '`workspaces` field in `package.json` is required')
  }

  unmock('../src/get-workspaces-package-dirs')
})

test('fs:getWorkspacesPackageDirs no workspaces.packages', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      workspaces: {},
    }),
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/readme.md`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)

  mock('../src/get-workspaces-package-dirs', {
    fs,
    'graceful-fs': fs,
  })

  const { getWorkspacesPackageDirs } = await import('../src/get-workspaces-package-dirs')

  try {
    await getWorkspacesPackageDirs()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, '`workspaces.packages` field in `package.json` is required')
  }

  unmock('../src/get-workspaces-package-dirs')
})
