import test from 'blue-tape'
import { getCrossDependents } from '../src/get-cross-dependents'

test('workspaces:getCrossDependents no cross dependencies', (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
        dependencies: {},
        devDependencies: {},
      },
    },
    b: {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0',
        dependencies: {},
        devDependencies: {},
      },
    },
    c: {
      dir: '/fakes/c',
      json: {
        name: '@ns/c',
        version: '0.3.0',
        dependencies: {},
        devDependencies: {},
      },
    },
  }

  t.deepEquals(
    getCrossDependents(packages),
    {},
    'empty object when there is no cross dependencies'
  )

  t.end()
})

test('workspaces:getCrossDependents one cross dependency', (t) => {
  const packages = {
    'ns/a': {
      dir: '/fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
        devDependencies: {},
      },
    },
    'ns/b': {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0',
        dependencies: { '@ns/a': '^0.1.0' },
      },
    },
    'ns/c': {
      dir: '/fakes/c',
      json: {
        name: '@ns/c',
        version: '0.3.0',
        dependencies: {},
        devDependencies: {},
      },
    },
  }

  t.deepEquals(
    getCrossDependents(packages),
    {
      'ns/a': [{ name: 'ns/b', range: '^0.1.0', devRange: null }],
    },
    'single cross dependency'
  )

  t.end()
})

test('workspaces:getCrossDependents multiple cross dependencies', (t) => {
  const packages = {
    'ns/a': {
      dir: '/fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
        dependencies: {},
        devDependencies: {},
      },
    },
    'ns/b': {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0',
        dependencies: { '@ns/a': '^0.1.0' },
        devDependencies: {},
      },
    },
    'ns/c': {
      dir: '/fakes/c',
      json: {
        name: '@ns/c',
        version: '0.3.0',
        dependencies: {},
        devDependencies: { '@ns/a': '^0.3.0' },
      },
    },
  }

  t.deepEquals(
    getCrossDependents(packages),
    {
      'ns/a': [
        { name: 'ns/b', range: '^0.1.0', devRange: null },
        { name: 'ns/c', range: null, devRange: '^0.3.0' },
      ],
    },
    'multiple cross dependencies'
  )

  t.end()
})

test('workspaces:getCrossDependents circular dependencies', (t) => {
  const packages = {
    'ns/a': {
      dir: '/fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
        dependencies: { '@ns/c': '^0.3.0' },
        devDependencies: {},
      },
    },
    'ns/b': {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0',
        dependencies: { '@ns/a': '^0.1.0' },
        devDependencies: {},
      },
    },
    'ns/c': {
      dir: '/fakes/c',
      json: {
        name: '@ns/c',
        version: '0.3.0',
        dependencies: { '@ns/b': '^0.2.0' },
        devDependencies: {},
      },
    },
  }

  t.deepEquals(
    getCrossDependents(packages),
    {
      'ns/a': [{ name: 'ns/b', range: '^0.1.0', devRange: null }],
      'ns/b': [{ name: 'ns/c', range: '^0.2.0', devRange: null }],
      'ns/c': [{ name: 'ns/a', range: '^0.3.0', devRange: null }],
    },
    'circular cross dependencies'
  )

  t.end()
})

test('workspaces:getCrossDependents multiple cross dependencies', (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: 'a',
        version: '0.1.0',
        dependencies: {},
        devDependencies: {},
      },
    },
    'ns/b': {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0',
        dependencies: { a: '^0.1.0' },
        devDependencies: {},
      },
    },
    c: {
      dir: '/fakes/c',
      json: {
        name: 'c',
        version: '0.3.0',
        dependencies: {},
        devDependencies: { a: '^0.3.0' },
      },
    },
  }

  t.deepEquals(
    getCrossDependents(packages),
    {
      a: [
        { name: 'ns/b', range: '^0.1.0', devRange: null },
        { name: 'c', range: null, devRange: '^0.3.0' },
      ],
    },
    'multiple cross dependencies'
  )

  t.end()
})
