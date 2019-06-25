import test from 'blue-tape'
import { getPackagesBumps } from '../src/get-packages-bumps'
import { TBumpOptions } from '../src/types'

const bumpOptions: TBumpOptions = {
  zeroBreakingChangeType: 'major',
  shouldAlwaysBumpDependents: true,
}

test('bump:getPackageBumps: single package', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
      },
      [
        { name: 'ns/a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
    ],
    'patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
      },
      [
        { name: 'ns/a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
    ],
    'minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.2.1',
          },
        },
      },
      [
        { name: 'ns/a', type: 'major', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
    ],
    'major'
  )

  t.end()
})

test('bump:getPackageBumps: multiple independent packages', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: 'b',
            version: '0.2.1',
          },
        },
        'ns/c': {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '1.2.1',
          },
        },
      },
      [
        { name: 'ns/a', type: 'patch', messages: [] },
        { name: 'b', type: 'minor', messages: [] },
        { name: 'ns/c', type: 'major', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '0.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'ns/c',
        dir: '/fakes/c',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
    ],
    'multiple'
  )

  t.end()
})

test('bump:getPackageBumps: b -> a (should always bump dependents)', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '~0.1.3',
        },
        devDeps: null,
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^1.2.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'major', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '^2.0.0',
        },
        devDeps: null,
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b -> a (should not always bump dependents)', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      {
        zeroBreakingChangeType: 'major',
        shouldAlwaysBumpDependents: false,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      {
        zeroBreakingChangeType: 'major',
        shouldAlwaysBumpDependents: false,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      {
        zeroBreakingChangeType: 'major',
        shouldAlwaysBumpDependents: false,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      {
        zeroBreakingChangeType: 'major',
        shouldAlwaysBumpDependents: false,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      {
        zeroBreakingChangeType: 'major',
        shouldAlwaysBumpDependents: false,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'major', messages: [] },
      ],
      {
        zeroBreakingChangeType: 'major',
        shouldAlwaysBumpDependents: false,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '^2.0.0',
        },
        devDeps: null,
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: self + b -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'b', type: 'patch', messages: [] },
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    'self = deps'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'b', type: 'major', messages: [] },
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    'self > patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'b', type: 'patch', messages: [] },
        { name: 'a', type: 'major', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '1.0.0',
        },
        devDeps: null,
      },
    ],
    'self < deps'
  )

  t.end()
})

test('bump:getPackageBumps: b |> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '~0.1.1',
        },
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.2.0',
        },
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'major', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^2.0.0',
        },
      },
    ],
    '^ minor (major 1)'
  )

  t.end()
})

test('bump:getPackageBumps: b -> a, c -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          a: '~0.1.1',
        },
        devDeps: null,
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '1.2.3',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '1.3.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '3.5.0',
        type: 'minor',
        deps: {
          a: '^1.3.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '1.2.3',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'major', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '3.0.0',
        type: 'major',
        deps: {
          a: '2.0.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '4.0.0',
        type: 'major',
        deps: {
          a: '^2.0.0',
        },
        devDeps: null,
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b |> a, c |> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '~0.1.1',
        },
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.2.0',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.2.0',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '1.2.3',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '1.3.0',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.3.0',
        },
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '1.2.3',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', type: 'major', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '2.0.0',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^2.0.0',
        },
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: c -> b -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          b: '1.2.4',
        },
        devDeps: null,
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '~0.1.2',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          b: '1.2.4',
        },
        devDeps: null,
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0',
        },
        devDeps: null,
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^1.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'major', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '^1.0.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '3.0.0',
        type: 'major',
        deps: {
          b: '2.0.0',
        },
        devDeps: null,
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: C |> b |> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '~0.1.2',
        },
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.2.0',
        },
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'major', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.0.0',
        },
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: c -> b -> a -> c', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: {
          c: '2.3.5',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          b: '1.2.4',
        },
        devDeps: null,
      },
    ],
    'a patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
        { name: 'b', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: {
          c: '2.4.0',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0',
        },
        devDeps: null,
      },
    ],
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
        { name: 'b', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: {
          c: '2.4.0',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0',
        },
        devDeps: null,
      },
    ],
    'a minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
        { name: 'b', type: 'major', messages: [] },
        { name: 'c', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'major',
        deps: {
          c: '3.0.0',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '1.0.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '3.0.0',
        type: 'major',
        deps: {
          b: '2.0.0',
        },
        devDeps: null,
      },
    ],
    'a patch + b major + c minor'
  )

  t.end()
})

test('bump:getPackageBumps: c |> b |> a |> c', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
    ],
    'a patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
        { name: 'b', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          b: '1.3.0',
        },
      },
    ],
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
        { name: 'b', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: null,
        devDeps: {
          a: '0.2.0',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          b: '1.2.4',
        },
      },
    ],
    'a minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
        { name: 'b', type: 'major', messages: [] },
        { name: 'c', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: {
          c: '2.4.0',
        },
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: null,
        devDeps: {
          b: '2.0.0',
        },
      },
    ],
    'a patch + b major + c minor'
  )

  t.end()
})

test('bump:getPackageBumps: c |> b, c -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
            },
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'patch', messages: [] },
        { name: 'b', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: {
          b: '1.3.0',
        },
      },
    ],
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
            },
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
        { name: 'b', type: 'major', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: {
          b: '2.0.0',
        },
      },
    ],
    'a minor + b major'
  )

  t.end()
})

test('bump:getPackageBumps: throw', (t) => {
  t.throws(
    () => getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
      },
      [
        { name: 'b', type: 'minor', messages: [] },
      ],
      bumpOptions
    ),
    /Unable to find package/,
    'not existing package'
  )

  t.end()
})

test('bump:getPackageBumps: sort', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
            },
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
          },
        },
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
      },
      [
        { name: 'a', type: 'minor', messages: [] },
        { name: 'b', type: 'major', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: {
          b: '2.0.0',
        },
      },
    ],
    'should sort'
  )

  t.end()
})

test('bump:getPackageBumps: transitive dep patch', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '^0.1.0',
              '@ns/b': '^0.0.0',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.0.0',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
      },
      [
        { name: 'b', type: 'minor', messages: [] },
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '0.1.0',
        type: 'minor',
        deps: {
          a: '^0.1.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '^0.1.0',
          a: '^0.1.1',
        },
        devDeps: null,
      },
    ],
    'should properly bump'
  )

  t.end()
})

test('bump:getPackageBumps: transitive devDep patch', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '^0.1.0',
              '@ns/b': '^0.0.0',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.0.0',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
      },
      [
        { name: 'b', type: 'minor', messages: [] },
        { name: 'a', type: 'patch', messages: [] },
      ],
      bumpOptions
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '0.1.0',
        type: 'minor',
        deps: {
          a: '^0.1.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          b: '^0.1.0',
          a: '^0.1.1',
        },
      },
    ],
    'should properly bump'
  )

  t.end()
})
