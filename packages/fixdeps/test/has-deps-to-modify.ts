/* eslint-disable no-sync */
import { promisify } from 'util'
import test from 'blue-tape'
import { mock, deleteFromCache } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()

test('has-deps-to-modify: all', async (t) => {
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

  deleteFromCache('fast-glob')

  const { hasDepsToModify } = await import('../src')
  const result = await hasDepsToModify({
    packagePath: rootDir,
    dependenciesGlobs: ['src/**/*.ts'],
    devDependenciesGlobs: ['test/**/*.ts', '!test/ignore.ts'],
    ignoredPackages: [
      '@babel/runtime',
    ],
  })

  t.equals(result, true)

  unmockIndex()
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

  deleteFromCache('fast-glob')

  const { hasDepsToModify } = await import('../src')
  const result = await hasDepsToModify({
    packagePath: rootDir,
    dependenciesGlobs: ['src/**/*.ts'],
    devDependenciesGlobs: ['test/**/*.ts'],
  })

  t.equals(result, false)

  unmockIndex()
})
