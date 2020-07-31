import test from 'tape'
import { getDependents } from '../../src/bump/get-dependents'
import type { TPackageMap } from '../../src/types'

test('bump:getDependents no cross dependencies', (t) => {
  const packages: TPackageMap = new Map()
    .set('a', {
      dir: '/fakes/a',
      json: {
        name: 'a',
        version: '0.1.0',
      },
    })
    .set('b', {
      dir: '/fakes/b',
      json: {
        name: 'b',
        version: '0.2.0',
      },
    })
    .set('c', {
      dir: '/fakes/c',
      json: {
        name: 'c',
        version: '0.3.0',
      },
    })

  t.deepEquals(
    getDependents(packages, 'a'),
    [],
    'no dependents'
  )

  t.deepEquals(
    getDependents(packages, 'b'),
    [],
    'no dependents'
  )

  t.deepEquals(
    getDependents(packages, 'c'),
    [],
    'no dependents'
  )

  t.end()
})

test('bump:getDependents multiple cross dependencies', (t) => {
  const packages: TPackageMap = new Map()
    .set('@ns/a', {
      dir: '/fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
      },
    })
    .set('@ns/b', {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0',
        dependencies: { '@ns/a': '^0.1.0' },
      },
    })
    .set('@ns/c', {
      dir: '/fakes/c',
      json: {
        name: '@ns/c',
        version: '0.3.0',
        dependencies: { '@ns/b': '^0.2.0' },
        devDependencies: { '@ns/a': '^0.3.0' },
      },
    })

  t.deepEquals(
    getDependents(packages, '@ns/a'),
    [
      '@ns/b',
      '@ns/c',
    ],
    'should return dependents'
  )

  t.deepEquals(
    getDependents(packages, '@ns/b'),
    [
      '@ns/c',
    ],
    'should return dependents'
  )

  t.deepEquals(
    getDependents(packages, '@ns/c'),
    [],
    'no dependents'
  )

  t.end()
})

test('bump:getDependents circular dependencies', (t) => {
  const packages: TPackageMap = new Map()
    .set('@ns/a', {
      dir: '/fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
        dependencies: { '@ns/c': '^0.3.0' },
      },
    })
    .set('@ns/b', {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0',
        dependencies: { '@ns/a': '^0.1.0' },
      },
    })
    .set('@ns/c', {
      dir: '/fakes/c',
      json: {
        name: '@ns/c',
        version: '0.3.0',
        dependencies: { '@ns/b': '^0.2.0' },
      },
    })

  t.deepEquals(
    getDependents(packages, '@ns/a'),
    ['@ns/b'],
    'circular cross dependencies'
  )
  t.deepEquals(
    getDependents(packages, '@ns/b'),
    ['@ns/c'],
    'circular cross dependencies'
  )
  t.deepEquals(
    getDependents(packages, '@ns/c'),
    ['@ns/a'],
    'circular cross dependencies'
  )

  t.end()
})
