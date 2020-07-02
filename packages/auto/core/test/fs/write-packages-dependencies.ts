/* eslint-disable node/no-sync */
import { promisify } from 'util'
import { mockRequire } from '@mock/require'
import { createFsFromVolume, Volume } from 'memfs'
import test from 'tape'

const rootDir = process.cwd()

test('fs:writePackageDependencies: ignore version bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
    }),
  })
  const fs = createFsFromVolume(vol)

  const unmockRequire = mockRequire('../../src/fs/write-packages-dependencies', {
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })

  const { writePackagesDependencies } = await import('../../src/fs/write-packages-dependencies')

  await writePackagesDependencies([{
    dir: `${rootDir}/fakes/a`,
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
    'should ignore version'
  )

  unmockRequire()
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

  const unmockRequire = mockRequire('../../src/fs/write-packages-dependencies', {
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })

  const { writePackagesDependencies } = await import('../../src/fs/write-packages-dependencies')

  await writePackagesDependencies([{
    dir: `${rootDir}/fakes/a`,
    deps: {
      '@ns/b': '0.0.2',
      '@ns/c': '0.0.3',
    },
    devDeps: null,
  }])

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

  unmockRequire()
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

  const unmockRequire = mockRequire('../../src/fs/write-packages-dependencies', {
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })

  const { writePackagesDependencies } = await import('../../src/fs/write-packages-dependencies')

  await writePackagesDependencies([{
    dir: `${rootDir}/fakes/a`,
    deps: null,
    devDeps: {
      '@ns/b': '0.0.2',
      '@ns/c': '0.0.3',
    },
  }])

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

  unmockRequire()
})
