import type { TPackageBumpMap } from '../../src/bump/types'
import type { TPackageMap, TPromptEditData } from '../../src/types'

export const makeTestPackages = () => {
  const packages: TPackageMap = new Map()

  packages
    .set('@ns/init1', {
      dir: 'fakes/init1',
      json: {
        name: '@ns/init1',
        version: '0.0.0',
        dependencies: {
          'bump-major': '0.1.0',
        },
      },
    })
    .set('@ns/init2', {
      dir: 'fakes/init2',
      json: {
        name: '@ns/init2',
        version: '0.0.0',
      },
    })
    .set('bump-major', {
      dir: 'fakes/bump-major',
      json: {
        name: 'bump-major',
        version: '0.1.0',
        dependencies: {
          '@ns/init1': '0.0.0',
        },
      },
    })
    .set('bump-patch', {
      dir: 'fakes/bump-patch',
      json: {
        name: 'bump-patch',
        version: '0.1.0',
      },
    })
    .set('dep-major', {
      dir: 'fakes/dep-major',
      json: {
        name: 'dep-major',
        version: '0.1.0',
        dependencies: {
          'bump-major': '0.1.0',
          'bump-patch': '0.1.0',
          '@ns/init1': '0.0.0',
        },
      },
    })
    .set('dep-patch', {
      dir: 'fakes/dep-patch',
      json: {
        name: 'dep-patch',
        version: '0.1.0',
        dependencies: {
          'bump-patch': '0.1.0',
        },
      },
    })
    .set('range-update', {
      dir: 'fakes/range-update',
      json: {
        name: 'range-update',
        version: '0.1.0',
        dependencies: {
          'bump-patch': '0.1.0',
        },
      },
    })
    .set('init-deps', {
      dir: 'fakes/init-deps',
      json: {
        name: 'init-deps',
        version: '0.2.0',
        dependencies: {
          '@ns/init1': '0.0.0',
        },
        devDependencies: {
          '@ns/init2': '0.0.0',
        },
      },
    })

  const bumps: TPackageBumpMap = new Map()

  bumps
    .set('@ns/init1', {
      type: 'initial',
      version: '0.1.0',
      deps: {
        'bump-major': '0.2.0',
      },
      devDeps: null,
    })
    .set('@ns/init2', {
      type: 'initial',
      version: '1.0.0',
      deps: null,
      devDeps: null,
    })
    .set('bump-major', {
      type: 'major',
      version: '0.2.0',
      deps: {
        '@ns/init1': '0.1.0',
      },
      devDeps: null,
    })
    .set('bump-patch', {
      type: 'patch',
      version: '0.1.1',
      deps: null,
      devDeps: null,
    })
    .set('dep-major', {
      type: 'major',
      version: '0.2.0',
      deps: {
        'bump-major': '0.2.0',
        'bump-patch': '0.1.1',
        '@ns/init1': '0.1.0',
      },
      devDeps: null,
    })
    .set('dep-patch', {
      type: 'patch',
      version: '0.1.1',
      deps: {
        'bump-patch': '0.1.1',
      },
      devDeps: null,
    })
    .set('range-update', {
      type: null,
      version: null,
      deps: {
        'bump-patch': '0.1.1',
      },
      devDeps: null,
    })
    .set('init-deps', {
      type: null,
      version: null,
      deps: {
        '@ns/init1': '0.1.0',
      },
      devDeps: {
        '@ns/init2': '0.1.0',
      },
    })

  const prevEditResult: TPromptEditData = {
    initialTypeOverrideMap: new Map()
      .set('@ns/init2', 'major')
      .set('non-existing', 'major'),
    dependencyBumpIgnoreMap: new Map()
      .set('dep-major', ['bump-patch', 'non-existing'])
      .set('non-exisitng', ['a', 'b']),
    zeroBreakingTypeOverrideMap: new Map()
      .set('dep-major', 'major')
      .set('non-existing', 'major'),
  }

  return {
    packages,
    bumps,
    prevEditResult,
  }
}
