import { promisify } from 'util'
import test from 'tape'
import { mock, deleteFromCache } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()

test('fs:writePackageDependencies: ignore version bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
    }),
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../../src/fs/write-packages-dependencies', {
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })

  deleteFromCache('pifs')

  const { writePackagesDependencies } = await import('../../src/fs/write-packages-dependencies')

  await writePackagesDependencies([{
    dir: `${rootDir}/fakes/a`,
    deps: null,
    devDeps: null,
  }])

  // eslint-disable-next-line no-sync
  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
    },
    'should ignore version'
  )

  unmock()
})

test('fs:writePackageDependencies: multiple dependencies bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        '@ns/b': '0.0.1',
        '@ns/c': '0.0.2',
      },
    }),
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../../src/fs/write-packages-dependencies', {
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })

  deleteFromCache('pifs')

  const { writePackagesDependencies } = await import('../../src/fs/write-packages-dependencies')

  await writePackagesDependencies([{
    dir: `${rootDir}/fakes/a`,
    deps: {
      '@ns/b': '0.0.2',
      '@ns/c': '0.0.3',
    },
    devDeps: null,
  }])

  // eslint-disable-next-line no-sync
  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        '@ns/b': '0.0.2',
        '@ns/c': '0.0.3',
      },
    },
    'should write bumps, and ignore version'
  )

  unmock()
})

test('fs:writePackageDependencies: multiple dev dependencies bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
      devDependencies: {
        '@ns/b': '0.0.1',
        '@ns/c': '0.0.2',
      },
    }),
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../../src/fs/write-packages-dependencies', {
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })

  deleteFromCache('pifs')

  const { writePackagesDependencies } = await import('../../src/fs/write-packages-dependencies')

  await writePackagesDependencies([{
    dir: `${rootDir}/fakes/a`,
    deps: null,
    devDeps: {
      '@ns/b': '0.0.2',
      '@ns/c': '0.0.3',
    },
  }])

  // eslint-disable-next-line no-sync
  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
      devDependencies: {
        '@ns/b': '0.0.2',
        '@ns/c': '0.0.3',
      },
    },
    'should write bumps, and ignore version'
  )

  unmock()
})
