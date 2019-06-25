import test from 'blue-tape'
import { mock, unmock, deleteFromCache } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()

test('fs:getPackageDirs workspaces[]', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      workspaces: ['fakes/*'],
    }),
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/readme.md`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)

  mock('../src/get-package-dirs', {
    fs,
    'graceful-fs': fs,
  })
  deleteFromCache('fast-glob')

  const { getPackageDirs } = await import('../src/get-package-dirs')
  t.deepEquals(
    await getPackageDirs(),
    [
      `${rootDir}/fakes/a`,
      `${rootDir}/fakes/c`,
    ],
    'should return packages directories'
  )

  unmock('../src/get-package-dirs')
})

test('fs:getPackageDirs workspaces.packages[]', async (t) => {
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

  mock('../src/get-package-dirs', {
    fs,
    'graceful-fs': fs,
  })

  const { getPackageDirs } = await import('../src/get-package-dirs')
  t.deepEquals(
    await getPackageDirs(),
    [
      `${rootDir}/fakes/a`,
      `${rootDir}/fakes/c`,
    ],
    'should return packages directories'
  )

  unmock('../src/get-package-dirs')
})

test('fs:getPackageDirs no workspaces', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({}),
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/readme.md`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)

  mock('../src/get-package-dirs', {
    fs,
    'graceful-fs': fs,
  })

  const { getPackageDirs } = await import('../src/get-package-dirs')

  try {
    await getPackageDirs()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, '`workspaces` field in `package.json` is required')
  }

  unmock('../src/get-package-dirs')
})

test('fs:getPackageDirs no workspaces.packages', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      workspaces: {},
    }),
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/readme.md`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)

  mock('../src/get-package-dirs', {
    fs,
    'graceful-fs': fs,
  })

  const { getPackageDirs } = await import('../src/get-package-dirs')

  try {
    await getPackageDirs()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, '`workspaces.packages` field in `package.json` is required')
  }

  unmock('../src/get-package-dirs')
})
