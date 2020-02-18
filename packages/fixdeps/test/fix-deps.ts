/* eslint-disable no-sync */
import { promisify } from 'util'
import test from 'blue-tape'
import { mock, deleteFromCache } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'
import { createSpy, getSpyCalls } from 'spyfn'

const rootDir = process.cwd()

test('fixdeps: all', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        '@babel/runtime': '^17',
        '@ns/a': '^1',
      },
      devDependencies: {
        '@types/execa': '^1',
        '@types/react': '^16',
        '@types/tape': '^2',
        '@types/foo': '^3',
        '@types/ns__a': '^1',
        bar: '^2',
        execa: '^1',
      },
      peerDependencies: {
        react: '^16',
        bar: '^3.0.0',
      },
    }),
    [`${rootDir}/src/index.ts`]: `
      import { a } from '@ns/a'
      import { b } from '@ns/b'
      import foo from 'foo'
    `,
    [`${rootDir}/test/index.ts`]: `
      import fs from 'fs'
      import execa from 'execa'
      import tape from 'tape'
    `,
    [`${rootDir}/test/ignore.ts`]: `
      import ignore from 'ignore'
    `,
  })
  const fs = createFsFromVolume(vol)

  const unmockIndex = mock('../src', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })
  const unmockGetPackageVersion = mock('../src/get-package-version', {
    './get-local-package-version-yarn': {
      getLocalPackageVersionYarn: () => '1.0.0',
    },
  })

  deleteFromCache('fast-glob')

  const { fixdeps } = await import('../src')

  const result = await fixdeps({
    packagePath: rootDir,
    dependenciesGlobs: ['src/**/*.ts'],
    devDependenciesGlobs: ['test/**/*.ts', '!test/ignore.ts'],
    ignoredPackages: [
      '@babel/runtime',
    ],
  })

  const packageJson = JSON.parse(fs.readFileSync(`${rootDir}/package.json`).toString())

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        '@babel/runtime': '^17',
        '@ns/a': '^1',
        '@ns/b': '^1.0.0',
        foo: '^1.0.0',
      },
      devDependencies: {
        '@types/execa': '^1',
        '@types/foo': '^3',
        '@types/ns__a': '^1',
        '@types/react': '^16',
        '@types/tape': '^2',
        bar: '^2',
        execa: '^1',
        react: '^16',
        tape: '^1.0.0',
      },
      peerDependencies: {
        react: '^16',
        bar: '^3.0.0',
      },
    }
  )

  t.deepEquals(
    result,
    {
      addedDeps: {
        '@ns/b': '^1.0.0',
        foo: '^1.0.0',
      },
      addedDevDeps: {
        react: '^16',
        tape: '^1.0.0',
      },
      removedDeps: [],
    },
    'should return result'
  )

  unmockIndex()
  unmockGetPackageVersion()
})

test('fixdeps: remove empty dependencies objects', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        '@babel/runtime': '^17',
        '@ns/a': '^1',
      },
      devDependencies: {
        '@types/execa': '^1',
        execa: '^1',
      },
    }),
    [`${rootDir}/src/index.ts`]: `
    `,
    [`${rootDir}/test/index.ts`]: `
    `,
  })
  const fs = createFsFromVolume(vol)

  const unmockIndex = mock('../src', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })
  const unmockGetPackageVersion = mock('../src/get-package-version', {
    './get-local-package-version-yarn': {
      getLocalPackageVersionYarn: () => '1.0.0',
    },
  })

  deleteFromCache('fast-glob')

  const { fixdeps } = await import('../src')

  await fixdeps({
    packagePath: rootDir,
    dependenciesGlobs: ['src/**/*.ts'],
    devDependenciesGlobs: ['test/**/*.ts'],
  })

  const packageJson = JSON.parse(fs.readFileSync(`${rootDir}/package.json`).toString())

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
    }
  )

  unmockIndex()
  unmockGetPackageVersion()
})

test('fixdeps: nothing to do', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        a: '^1',
      },
      devDependencies: {
        b: '^1',
      },
    }),
    [`${rootDir}/src/index.ts`]: `
      import a from 'a'
    `,
    [`${rootDir}/test/index.ts`]: `
      import b from 'b'
    `,
  })
  const fs = createFsFromVolume(vol)

  const unmockIndex = mock('../src', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })
  const unmockGetPackageVersion = mock('../src/get-package-version', {
    './get-local-package-version-yarn': {
      getLocalPackageVersionYarn: () => '1.0.0',
    },
  })

  deleteFromCache('fast-glob')

  const { fixdeps } = await import('../src')

  const result = await fixdeps({
    packagePath: rootDir,
    dependenciesGlobs: ['src/**/*.ts'],
    devDependenciesGlobs: ['test/**/*.ts'],
  })

  const packageJson = JSON.parse(fs.readFileSync(`${rootDir}/package.json`).toString())

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        a: '^1',
      },
      devDependencies: {
        b: '^1',
      },
    }
  )

  t.equals(
    result,
    null,
    'return null if nothing to do'
  )

  unmockIndex()
  unmockGetPackageVersion()
})

test('fixdeps: create dependencies objects if was missing', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
    }),
    [`${rootDir}/test/index.ts`]: `
      import a from 'a'
    `,
  })
  const fs = createFsFromVolume(vol)

  const unmockIndex = mock('../src', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })
  const unmockGetPackageVersion = mock('../src/get-package-version', {
    './get-local-package-version-yarn': {
      getLocalPackageVersionYarn: () => '1.0.0',
    },
  })

  deleteFromCache('fast-glob')

  const { fixdeps } = await import('../src')

  await fixdeps({
    packagePath: rootDir,
    dependenciesGlobs: ['src/**/*.ts'],
    devDependenciesGlobs: ['test/**/*.ts'],
  })

  const packageJson = JSON.parse(fs.readFileSync(`${rootDir}/package.json`, 'utf8') as string)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
      devDependencies: {
        a: '^1.0.0',
      },
    }
  )

  unmockIndex()
  unmockGetPackageVersion()
})

test('fixdeps: get remote version with npm', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0',
    }),
    [`${rootDir}/src/index.ts`]: `
      import a from 'a'
    `,
    [`${rootDir}/src/index2.ts`]: `
      import a from 'a'
    `,
  })
  const fs = createFsFromVolume(vol)
  const spy = createSpy(() => '1.0.0')

  const unmockIndex = mock('../src', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    },
  })
  const unmockGetPackageVersion = mock('../src/get-package-version', {
    './get-local-package-version-yarn': {
      getLocalPackageVersionYarn: () => null,
    },
    './get-remote-package-version-npm': {
      getRemotePackageVersionNpm: spy,
    },
  })

  deleteFromCache('fast-glob')

  const { fixdeps } = await import('../src')

  await fixdeps({
    packagePath: rootDir,
    dependenciesGlobs: ['src/**/*.ts'],
    devDependenciesGlobs: ['test/**/*.ts'],
  })

  const packageJson = JSON.parse(fs.readFileSync(`${rootDir}/package.json`, 'utf8') as string)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        a: '^1.0.0',
      },
    },
    'should get version from npm'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [
        'a',
      ],
    ],
    'should call npm once'
  )

  unmockIndex()
  unmockGetPackageVersion()
})
