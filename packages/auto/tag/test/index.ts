import type { TPackageRelease } from '@auto/core'
import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { prefixes } from './prefixes'

test('writePublishTags: multiple tags', async (t) => {
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../src', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
  })

  const packages: TPackageRelease[] = [
    {
      name: 'ns/a',
      type: 'patch',
      version: '0.1.1',
      dir: 'fakes/a',
      json: {
        name: '@ns/a',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: null,
    },
    {
      name: 'b',
      type: 'minor',
      version: '0.2.0',
      dir: 'fakes/b',
      json: {
        name: 'b',
        version: '0.1.0',
      },
      deps: null,
      devDeps: null,
      messages: null,
    },
    {
      name: 'c',
      type: null,
      version: null,
      dir: 'fakes/c',
      json: {
        name: 'c',
        version: '1.0.0',
      },
      deps: null,
      devDeps: null,
      messages: null,
    },
  ]

  const { writePublishTags } = await import('../src')

  await writePublishTags({
    config: {},
    prefixes,
    packages,
  })

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'git tag -a ns/a@0.1.1 -m "ns/a@0.1.1"',
        { stdout: null, stderr: process.stderr },
      ],
      [
        'git tag -a b@0.2.0 -m "b@0.2.0"',
        { stdout: null, stderr: process.stderr },
      ],
    ],
    'multiple tags'
  )

  unmockRequire()
})
