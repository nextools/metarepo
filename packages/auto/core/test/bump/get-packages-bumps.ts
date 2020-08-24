import test from 'tape'
import { getPackagesBumps } from '../../src/bump/get-packages-bumps'

test('bump:getPackageBumps: single package', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        }),
      bumps: new Map().set('ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      }),
    'patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        }),
      bumps: new Map().set('ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      }),
    'minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.2.1',
          },
        }),
      bumps: new Map().set('ns/a', [{ type: 'major', message: '' }]),
    }),
    new Map()
      .set('ns/a', {
        version: '0.3.0',
        type: 'major',
        deps: null,
        devDeps: null,
      }),
    'major (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        }),
      bumps: new Map().set('ns/a', [{ type: 'major', message: '' }]),
    }),
    new Map()
      .set('ns/a', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      }),
    'major (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.2.3',
          },
        }),
      bumps: new Map().set('ns/a', [{ type: 'major', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map(),
        zeroBreakingTypeOverrideMap: new Map().set('ns/a', 'patch'),
      },
    }),
    new Map()
      .set('ns/a', {
        version: '0.2.4',
        type: 'major',
        deps: null,
        devDeps: null,
      }),
    'major override (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        }),
      bumps: new Map().set('ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      }),
    'initial'
  )

  t.end()
})

test('bump:getPackageBumps: multiple independent packages', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: 'b',
            version: '0.2.1',
          },
        })
        .set('ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '1.2.1',
          },
        })
        .set('d', {
          dir: '/fakes/d',
          json: {
            name: 'd',
            version: '0.0.0',
          },
        }),
      bumps: new Map()
        .set('ns/a', [{ type: 'patch', message: '' }])
        .set('@ns/b', [{ type: 'minor', message: '' }])
        .set('ns/c', [{ type: 'major', message: '' }])
        .set('d', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('ns/a', {
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '0.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('ns/c', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('d', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      }),
    'multiple independent bumps'
  )

  t.end()
})

test('bump:getPackageBumps: b -> a', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: null,
      }),
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '~0.1.3',
        },
        devDeps: null,
      }),
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: null,
      }),
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: null,
      }),
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^1.2.0',
        },
        devDeps: null,
      }),
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'major', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: {
          '@ns/a': '^2.0.0',
        },
        devDeps: null,
      }),
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b -> a (should always bump dependents)', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: null,
      }),
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '~0.1.3',
        },
        devDeps: null,
      }),
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
            auto: {
              bump: {
                shouldAlwaysBumpDependents: true,
              },
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '~0.1.3',
        },
        devDeps: null,
      }),
    '~ patch (shouldAlwaysBumpDependent override)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: null,
      }),
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: null,
      }),
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '^1.2.0',
        },
        devDeps: null,
      }),
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'major', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: {
          '@ns/a': '^2.0.0',
        },
        devDeps: null,
      }),
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b -> a (should always bump dependents + ignored by edit)', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
      edit: {
        initialTypeOverrideMap: new Map(),
        zeroBreakingTypeOverrideMap: new Map(),
        dependencyBumpIgnoreMap: new Map().set('@ns/b', ['@ns/a']),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: null,
      }),
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
      edit: {
        initialTypeOverrideMap: new Map(),
        zeroBreakingTypeOverrideMap: new Map(),
        dependencyBumpIgnoreMap: new Map().set('@ns/b', ['@ns/a']),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '~0.1.3',
        },
        devDeps: null,
      }),
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
            auto: {
              bump: {
                shouldAlwaysBumpDependents: true,
              },
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
      edit: {
        initialTypeOverrideMap: new Map(),
        zeroBreakingTypeOverrideMap: new Map(),
        dependencyBumpIgnoreMap: new Map().set('@ns/b', ['@ns/a']),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '~0.1.3',
        },
        devDeps: null,
      }),
    '~ patch (shouldAlwaysBumpDependent override)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
      edit: {
        initialTypeOverrideMap: new Map(),
        zeroBreakingTypeOverrideMap: new Map(),
        dependencyBumpIgnoreMap: new Map().set('@ns/b', ['@ns/a']),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: null,
      }),
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
      edit: {
        initialTypeOverrideMap: new Map(),
        zeroBreakingTypeOverrideMap: new Map(),
        dependencyBumpIgnoreMap: new Map().set('@ns/b', ['@ns/a']),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: null,
      }),
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
      edit: {
        initialTypeOverrideMap: new Map(),
        zeroBreakingTypeOverrideMap: new Map(),
        dependencyBumpIgnoreMap: new Map().set('@ns/b', ['@ns/a']),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^1.2.0',
        },
        devDeps: null,
      }),
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'major', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
      edit: {
        initialTypeOverrideMap: new Map(),
        zeroBreakingTypeOverrideMap: new Map(),
        dependencyBumpIgnoreMap: new Map().set('@ns/b', ['@ns/a']),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^2.0.0',
        },
        devDeps: null,
      }),
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b -> ia', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '0.1.0',
        },
        devDeps: null,
      }),
    'exact version initial'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '~0.0.1',
        },
        devDeps: null,
      }),
    '~ initial patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^0.1.0',
        },
        devDeps: null,
      }),
    '~ initial minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^0.1.0',
        },
        devDeps: null,
      }),
    '^ initial minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^0.1.0',
        },
        devDeps: null,
      }),
    '^ initial minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'major'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^1.0.0',
        },
        devDeps: null,
      }),
    '^ initial major'
  )

  t.end()
})

test('bump:getPackageBumps: b |> a (should always bump dependents)', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.1.1',
        },
      }),
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '~0.1.3',
        },
      }),
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.2.0',
        },
      }),
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.2.0',
        },
      }),
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^1.2.0',
        },
      }),
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'major', message: '' }]),
      config: {
        shouldAlwaysBumpDependents: true,
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^2.0.0',
        },
      }),
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b |> a', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.1.1',
        },
      }),
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '~0.1.3',
        },
      }),
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.2.0',
        },
      }),
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.2.0',
        },
      }),
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^1.2.0',
        },
      }),
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'major', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^2.0.0',
        },
      }),
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b |> ia', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.1.0',
        },
      }),
    'exact version initial'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '~0.0.1',
        },
      }),
    '~ initial patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.1.0',
        },
      }),
    '~ initial minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.1.0',
        },
      }),
    '^ initial minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.1.0',
        },
      }),
    '^ initial minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'major'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^1.0.0',
        },
      }),
    '^ initial major'
  )

  t.end()
})

test('bump:getPackageBumps: self + b -> a', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/b', [{ type: 'patch', message: '' }])
        .set('@ns/a', [{ type: 'patch', message: '' }]),

    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: null,
      }),
    'self = deps'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/b', [{ type: 'major', message: '' }])
        .set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: null,
      }),
    'self > patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/b', [{ type: 'patch', message: '' }])
        .set('@ns/a', [{ type: 'major', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: {
          '@ns/a': '0.2.0',
        },
        devDeps: null,
      }),
    'self < deps'
  )

  t.end()
})

test('bump:getPackageBumps: self + b -> ia', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/b', [{ type: 'patch', message: '' }])
        .set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '0.0.1',
        },
        devDeps: null,
      }),
    'self = deps'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/b', [{ type: 'major', message: '' }])
        .set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: {
          '@ns/a': '0.0.1',
        },
        devDeps: null,
      }),
    'self > patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/b', [{ type: 'patch', message: '' }])
        .set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'major'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '1.0.0',
        },
        devDeps: null,
      }),
    'self < deps'
  )

  t.end()
})

test('bump:getPackageBumps: b -> a, c -> a', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.3.5',
        type: 'patch',
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: null,
      }),
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '~0.1.1',
        },
        devDeps: null,
      }),
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '0.2.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.4.0',
        type: 'minor',
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: null,
      }),
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '0.2.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.4.0',
        type: 'minor',
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: null,
      }),
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '1.2.3',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.4.0',
        type: 'minor',
        deps: {
          '@ns/a': '1.3.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^1.3.0',
        },
        devDeps: null,
      }),
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '1.2.3',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'major', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '3.0.0',
        type: 'major',
        deps: {
          '@ns/a': '2.0.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '4.0.0',
        type: 'major',
        deps: {
          '@ns/a': '^2.0.0',
        },
        devDeps: null,
      }),
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b |> a, c |> a', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.1.1',
        },
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.1.1',
        },
      }),
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.1.1',
        },
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '~0.1.1',
        },
      }),
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.2.0',
        },
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.2.0',
        },
      }),
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.2.0',
        },
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.2.0',
        },
      }),
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '1.2.3',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '1.3.0',
        },
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^1.3.0',
        },
      }),
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '1.2.3',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'major', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '2.0.0',
        },
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^2.0.0',
        },
      }),
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: c -> b -> a', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.3.5',
        type: 'patch',
        deps: {
          '@ns/b': '1.2.4',
        },
        devDeps: null,
      }),
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
            auto: {
              bump: {
                shouldAlwaysBumpDependents: true,
              },
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '~1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '~0.1.2',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: {
          '@ns/b': '~1.2.4',
        },
        devDeps: null,
      }),
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '~1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.4.0',
        type: 'minor',
        deps: {
          '@ns/b': '^1.3.0',
        },
        devDeps: null,
      }),
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '^1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: {
          '@ns/b': '^1.3.0',
        },
        devDeps: null,
      }),
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.1',
            auto: {
              bump: {
                shouldAlwaysBumpDependents: true,
              },
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '^1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '^1.2.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: {
          '@ns/b': '^1.3.0',
        },
        devDeps: null,
      }),
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '^1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'major', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '3.0.0',
        type: 'major',
        deps: {
          '@ns/b': '^2.0.0',
        },
        devDeps: null,
      }),
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: c -> b -> ia', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '0.0.1',
        },
        devDeps: null,
      }),
    'exact version initial patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '~0.0.1',
        },
        devDeps: null,
      }),
    '~ initial patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),

    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^0.1.0',
        },
        devDeps: null,
      }),
    '~ initial minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '0.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),

    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^0.1.0',
        },
        devDeps: null,
      }),
    '^ initial minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),

    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^0.1.0',
        },
        devDeps: null,
      }),
    '^ initial minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'major'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '^1.0.0',
        },
        devDeps: null,
      }),
    '^ initial major'
  )

  t.end()
})

test('bump:getPackageBumps: C |> b |> a', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.1.1',
        },
      }),
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '~0.1.2',
        },
      }),
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.2.0',
        },
      }),
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.2.0',
        },
      }),
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.1',
            auto: {
              bump: {
                shouldAlwaysBumpDependents: true,
              },
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^1.2.0',
        },
      }),
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'major', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.2.0',
        },
      }),
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: C |> b |> ia', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.0.1',
        },
      }),
    'exact version initial'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '~0.0.1',
        },
      }),
    '~ initial patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.1.0',
        },
      }),
    '~ initial minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '0.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.1.0',
        },
      }),
    '^ initial minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^0.1.0',
        },
      }),
    '^ initial minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'major'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '^1.0.0',
        },
      }),
    '^ initial major'
  )

  t.end()
})

test('bump:getPackageBumps: c -> b -> a -> c', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: {
          '@ns/c': '2.3.5',
        },
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.3.5',
        type: 'patch',
        deps: {
          '@ns/b': '1.2.4',
        },
        devDeps: null,
      }),
    'a patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'patch', message: '' }])
        .set('@ns/b', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: {
          '@ns/c': '2.4.0',
        },
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '0.2.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.4.0',
        type: 'minor',
        deps: {
          '@ns/b': '1.3.0',
        },
        devDeps: null,
      }),
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'minor', message: '' }])
        .set('@ns/b', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: {
          '@ns/c': '2.4.0',
        },
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '0.2.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.4.0',
        type: 'minor',
        deps: {
          '@ns/b': '1.3.0',
        },
        devDeps: null,
      })
    ,
    'a minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '0.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '0.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'patch', message: '' }])
        .set('@ns/b', [{ type: 'major', message: '' }])
        .set('@ns/c', [{ type: 'minor', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map(),
        zeroBreakingTypeOverrideMap: new Map().set('@ns/c', 'patch'),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'major',
        deps: {
          '@ns/c': '0.3.5',
        },
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: {
          '@ns/a': '0.2.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '0.3.5',
        type: 'major',
        deps: {
          '@ns/b': '2.0.0',
        },
        devDeps: null,
      }),
    'a patch + b major + c minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '0.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '0.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/b', [{ type: 'major', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map(),
        zeroBreakingTypeOverrideMap: new Map().set('@ns/c', 'patch'),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'major',
        deps: {
          '@ns/c': '0.3.5',
        },
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/c', {
        version: '0.3.5',
        type: 'major',
        deps: {
          '@ns/a': '0.2.0',
          '@ns/b': '2.0.0',
        },
        devDeps: null,
      }),
    'a patch + b major + c minor'
  )

  t.end()
})

test('bump:getPackageBumps: self + c -> b -> ia -> c', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/c', [{ type: 'minor', message: '' }])
        .set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/c', {
        version: '2.4.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: {
          '@ns/c': '2.4.0',
        },
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: {
          '@ns/a': '0.0.1',
        },
        devDeps: null,
      }),
    'minor c, a initial patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'initial', message: '' }])
        .set('@ns/b', [{ type: 'minor', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: {
          '@ns/c': '2.4.0',
        },
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: {
          '@ns/a': '0.0.1',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.4.0',
        type: 'minor',
        deps: {
          '@ns/b': '1.3.0',
        },
        devDeps: null,
      }),
    'a initial patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'initial', message: '' }])
        .set('@ns/b', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: {
          '@ns/c': '2.3.5',
        },
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: {
          '@ns/a': '0.1.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.3.5',
        type: 'patch',
        deps: {
          '@ns/b': '1.2.4',
        },
        devDeps: null,
      }),
    'a initial minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'initial', message: '' }])
        .set('@ns/b', [{ type: 'major', message: '' }])
        .set('@ns/c', [
          { type: 'patch', message: '' },
          { type: 'minor', message: '' },
          { type: 'patch', message: '' },
        ]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: {
          '@ns/c': '3.0.0',
        },
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: {
          '@ns/a': '0.0.1',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '3.0.0',
        type: 'major',
        deps: {
          '@ns/b': '2.0.0',
        },
        devDeps: null,
      }),
    'a initial patch + b major + c minor'
  )

  t.end()
})

test('bump:getPackageBumps: c |> b |> a |> c', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.1.1',
        },
      }),
    'a patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'patch', message: '' }])
        .set('@ns/b', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: {
          '@ns/a': '0.1.1',
        },
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/b': '1.3.0',
        },
      }),
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'minor', message: '' }])
        .set('@ns/b', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: null,
        devDeps: {
          '@ns/a': '0.2.0',
        },
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/b': '1.2.4',
        },
      }),
    'a minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'patch', message: '' }])
        .set('@ns/b', [{ type: 'major', message: '' }])
        .set('@ns/c', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: {
          '@ns/c': '2.4.0',
        },
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: {
          '@ns/a': '0.1.1',
        },
      })
      .set('@ns/c', {
        version: '2.4.0',
        type: 'minor',
        deps: null,
        devDeps: {
          '@ns/b': '2.0.0',
        },
      }),
    'a patch + b major + c minor'
  )

  t.end()
})

test('bump:getPackageBumps: c |> b |> ia |> c', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map().set('@ns/a', [{ type: 'initial', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/a': '0.0.1',
        },
      }),
    'a initial patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'initial', message: '' }])
        .set('@ns/b', [{ type: 'minor', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: {
          '@ns/a': '0.0.1',
        },
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/b': '1.3.0',
        },
      }),
    'a initial patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'initial', message: '' }])
        .set('@ns/b', [{ type: 'patch', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.2.4',
        type: 'patch',
        deps: null,
        devDeps: {
          '@ns/a': '0.1.0',
        },
      })
      .set('@ns/c', {
        version: null,
        type: null,
        deps: null,
        devDeps: {
          '@ns/b': '1.2.4',
        },
      }),
    'a initial minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'initial', message: '' }])
        .set('@ns/b', [{ type: 'major', message: '' }])
        .set('@ns/c', [{ type: 'minor', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map(),
      },
    }),
    new Map()
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: {
          '@ns/c': '2.4.0',
        },
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: {
          '@ns/a': '0.0.1',
        },
      })
      .set('@ns/c', {
        version: '2.4.0',
        type: 'minor',
        deps: null,
        devDeps: {
          '@ns/b': '2.0.0',
        },
      }),
    'a initial patch + b major + c minor'
  )

  t.end()
})

test('bump:getPackageBumps: c |> b, c -> a (should always bump dependents)', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
          },
        })
        .set('@ns/c', {
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
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'patch', message: '' }])
        .set('@ns/b', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.3.5',
        type: 'patch',
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: {
          '@ns/b': '1.3.0',
        },
      }),
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
          },
        })
        .set('@ns/c', {
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
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'minor', message: '' }])
        .set('@ns/b', [{ type: 'major', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.4.0',
        type: 'minor',
        deps: {
          '@ns/a': '0.2.0',
        },
        devDeps: {
          '@ns/b': '2.0.0',
        },
      }),
    'a minor + b major'
  )

  t.end()
})

test('bump:getPackageBumps: c |> b, c -> a', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
            },
            devDependencies: {
              '@ns/b': '^1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'patch', message: '' }])
        .set('@ns/b', [{ type: 'minor', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.3.5',
        type: 'patch',
        deps: {
          '@ns/a': '0.1.1',
        },
        devDeps: {
          '@ns/b': '^1.3.0',
        },
      }),
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
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
            version: '1.2.3',
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
            devDependencies: {
              '@ns/b': '^1.2.3',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/a', [{ type: 'minor', message: '' }])
        .set('@ns/b', [{ type: 'major', message: '' }]),
    }),
    new Map()
      .set('@ns/a', {
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      })
      .set('@ns/b', {
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      })
      .set('@ns/c', {
        version: '2.4.0',
        type: 'minor',
        deps: {
          '@ns/a': '^0.2.0',
        },
        devDeps: {
          '@ns/b': '^2.0.0',
        },
      }),
    'a minor + b major'
  )

  t.end()
})

test('bump:getPackageBumps: c -> ib -> ia -> c', (t) => {
  t.deepEquals(
    getPackagesBumps({
      packages: new Map()
        .set('@ns/a', {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            dependencies: {
              '@ns/c': '1.2.3',
            },
          },
        })
        .set('@ns/b', {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.0.0',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        })
        .set('@ns/c', {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '0.2.3',
            dependencies: {
              '@ns/b': '0.0.0',
            },
          },
        }),
      bumps: new Map()
        .set('@ns/b', [{ type: 'initial', message: '' }])
        .set('@ns/a', [{ type: 'initial', message: '' }])
        .set('@ns/c', [{ type: 'major', message: '' }]),
      edit: {
        dependencyBumpIgnoreMap: new Map(),
        initialTypeOverrideMap: new Map().set('@ns/a', 'patch'),
        zeroBreakingTypeOverrideMap: new Map().set('@ns/c', 'major'),
      },
    }),
    new Map()
      .set('@ns/b', {
        version: '0.1.0',
        type: 'initial',
        deps: {
          '@ns/a': '0.0.1',
        },
        devDeps: null,
      })
      .set('@ns/a', {
        version: '0.0.1',
        type: 'initial',
        deps: {
          '@ns/c': '1.0.0',
        },
        devDeps: null,
      })
      .set('@ns/c', {
        version: '1.0.0',
        type: 'major',
        deps: {
          '@ns/b': '0.1.0',
        },
        devDeps: null,
      }),
    'initial a, initial b, c major'
  )

  t.end()
})
