import test from 'blue-tape'
import { getDependentsOf } from '../src/get-dependents-of'

test('workspaces:getDependentsOf circular cross dependencies', (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
        dependencies: { '@ns/c': '^0.3.0' },
        devDependencies: {},
      },
    },
    b: {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0',
        dependencies: { '@ns/a': '^0.1.0' },
        devDependencies: {},
      },
    },
    c: {
      dir: '/fakes/c',
      json: {
        name: '@ns/c',
        version: '0.3.0',
        dependencies: { '@ns/b': '^0.2.0' },
        devDependencies: {},
      },
    },
  }

  const crossDependents = {
    a: [{ name: 'b', range: '^0.1.0', devRange: null }],
    b: [{ name: 'c', range: '^0.2.0', devRange: null }],
    c: [{ name: 'a', range: '^0.3.0', devRange: null }],
  }

  t.deepEquals(
    getDependentsOf(crossDependents, packages, 'a'),
    [{ name: 'b', range: '^0.1.0', devRange: null }],
    'circular cross dependencies'
  )

  t.end()
})

test('workspaces:getDependentsOf no dependents', (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
      },
    },
    b: {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0',
      },
    },
    c: {
      dir: '/fakes/c',
      json: {
        name: '@ns/c',
        version: '0.3.0',
      },
    },
  }

  const crossDependents = {}

  t.deepEquals(
    getDependentsOf(crossDependents, packages, 'a'),
    null,
    'no dependents'
  )

  t.end()
})
