import { mockRequire } from '@mock/require'
import test from 'tape'

test('resolveNpmConfig', async (t) => {
  let i = 0
  const localPackages: any = [
    {},
    {},
    {
      auto: {
        npm: {
          registry: 'https://local',
          publishSubDirectory: 'dist',
          access: 'restricted',
        },
      },
    },
    {
      auto: {
        npm: {
          registry: 'https://local',
          publishSubDirectory: 'dist',
          access: 'restricted',
        },
      },
    },
  ]

  const unmockRequire = mockRequire('../../src/npm/resolve-npm-config', {
    '../../src/fs/read-package': {
      readPackage: () => Promise.resolve(localPackages[i++]),
    },
  })

  const { resolveNpmConfig } = await import('../../src/npm/resolve-npm-config')

  t.deepEquals(
    await resolveNpmConfig(''),
    {
      registry: 'https://registry.npmjs.org/',
      publishSubDirectory: '',
      access: 'restricted',
    },
    'defaults'
  )

  t.deepEquals(
    await resolveNpmConfig(
      '',
      {
        registry: 'http://custom',
        publishSubDirectory: 'build',
        access: 'public',
      }
    ),
    {
      registry: 'http://custom',
      publishSubDirectory: 'build',
      access: 'public',
    },
    'root options'
  )

  t.deepEquals(
    await resolveNpmConfig(
      '',
      {
        registry: 'http://custom',
        publishSubDirectory: 'build',
        access: 'public',
      }
    ),
    {
      registry: 'https://local',
      publishSubDirectory: 'dist',
      access: 'restricted',
    },
    'local override'
  )

  t.deepEquals(
    await resolveNpmConfig(
      '',
      {
        registry: 'http://custom',
        publishSubDirectory: 'build',
        access: 'public',
      },
      'https://override'
    ),
    {
      registry: 'https://override',
      publishSubDirectory: 'dist',
      access: 'restricted',
    },
    'registry override'
  )

  unmockRequire()
})
