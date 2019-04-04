import test from 'blue-tape'
import { TWorkspacesOptions } from '@auto/utils'
import { getCrossDependents } from '../src/get-cross-dependents'

const options: TWorkspacesOptions = {
  autoNamePrefix: '@ns/',
}

test('workspaces:getCrossDependents no cross dependencies', async (t) => {
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
    await getCrossDependents(packages, options),
    {},
    'empty object when there is no cross dependencies'
  )
})

test('workspaces:getCrossDependents one cross dependency', async (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
        devDependencies: {},
      },
    },
    b: {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0',
        dependencies: { '@ns/a': '^0.1.0' },
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
    await getCrossDependents(packages, options),
    {
      a: [{ name: 'b', range: '^0.1.0', devRange: null }],
    },
    'single cross dependency'
  )
})

test('workspaces:getCrossDependents multiple cross dependencies', async (t) => {
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
        dependencies: { '@ns/a': '^0.1.0' },
        devDependencies: {},
      },
    },
    c: {
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
    await getCrossDependents(packages, options),
    {
      a: [
        { name: 'b', range: '^0.1.0', devRange: null },
        { name: 'c', range: null, devRange: '^0.3.0' },
      ],
    },
    'multiple cross dependencies'
  )
})

test('workspaces:getCrossDependents circular dependencies', async (t) => {
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

  t.deepEquals(
    await getCrossDependents(packages, options),
    {
      a: [{ name: 'b', range: '^0.1.0', devRange: null }],
      b: [{ name: 'c', range: '^0.2.0', devRange: null }],
      c: [{ name: 'a', range: '^0.3.0', devRange: null }],
    },
    'circular cross dependencies'
  )
})
