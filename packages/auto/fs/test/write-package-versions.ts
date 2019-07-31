/* eslint-disable no-sync */
import test from 'blue-tape'
import { mock } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()

test('fs:writePackageVersion: single version bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
    }),
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../src/write-package-versions', {
    'graceful-fs': fs,
  })

  const { writePackageVersions } = await import('../src/write-package-versions')

  await writePackageVersions([{
    name: 'a',
    dir: `${rootDir}/fakes/a`,
    version: '1.0.1',
    type: null,
    deps: null,
    devDeps: null,
  }])

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.1',
    },
    'should write bumps'
  )

  unmock()
})

test('fs:writePackageVersion: ignore dependencies', async (t) => {
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

  const unmock = mock('../src/write-package-versions', {
    'graceful-fs': fs,
  })

  const { writePackageVersions } = await import('../src/write-package-versions')

  await writePackageVersions([{
    name: 'a',
    dir: `${rootDir}/fakes/a`,
    version: '1.0.1',
    type: null,
    deps: {
      b: '0.0.2',
      c: '0.0.3',
    },
    devDeps: null,
  }])

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.1',
      dependencies: {
        '@ns/b': '0.0.1',
        '@ns/c': '0.0.2',
      },
    },
    'should write version, and skip dependencies'
  )

  unmock()
})

test('fs:writePackageVersion: ignore devDependencies', async (t) => {
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

  const unmock = mock('../src/write-package-versions', {
    'graceful-fs': fs,
  })

  const { writePackageVersions } = await import('../src/write-package-versions')

  await writePackageVersions([{
    name: 'a',
    dir: `${rootDir}/fakes/a`,
    version: '1.0.1',
    type: null,
    deps: null,
    devDeps: {
      b: '0.0.2',
      c: '0.0.3',
    },
  }])

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.1',
      devDependencies: {
        '@ns/b': '0.0.1',
        '@ns/c': '0.0.2',
      },
    },
    'should write version, and skip devDependencies'
  )

  unmock()
})

test('fs:writePackageVersion: no version bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
    }),
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../src/write-package-versions', {
    'graceful-fs': fs,
  })

  const { writePackageVersions } = await import('../src/write-package-versions')

  await writePackageVersions([{
    name: 'a',
    dir: `${rootDir}/fakes/a`,
    version: null,
    type: null,
    deps: null,
    devDeps: null,
  }])

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
    },
    'should not write version'
  )

  unmock()
})
