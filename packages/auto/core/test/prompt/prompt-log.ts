import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import type { TPackageBumpMap } from '../../src/bump/types'
import type { TGitMessageMap } from '../../src/types'
import { prefixes } from '../prefixes'

test('promptLog', async (t) => {
  const logSpy = createSpy(() => {})
  const unmockRequire = mockRequire('../../src/prompt/prompt-log', {
    '../../src/prompt/log': {
      log: logSpy,
    },
  })
  const packages: TPackageBumpMap = new Map()

  packages
    .set('ns/a', {
      type: 'minor',
      version: '0.2.0',
      deps: null,
      devDeps: null,
    })
    .set('b1', {
      type: 'initial',
      version: '0.1.0',
      deps: {
        'ns/a': '^0.2.0',
      },
      devDeps: null,
    })
    .set('c', {
      version: '1.1.0',
      type: 'minor',
      deps: {
        b1: '^0.1.0',
        'ns/a': '^0.2.0',
        'non-existing': '0.1.0',
      },
      devDeps: null,
    })
    .set('d', {
      version: null,
      type: null,
      deps: null,
      devDeps: {
        b1: '^0.1.0',
      },
    })
    .set('e', {
      version: '1.0.0',
      type: 'major',
      deps: {
        b1: '0.1.0',
      },
      devDeps: null,
    })

  const gitBumps: TGitMessageMap = new Map()

  gitBumps
    .set('ns/a', [
      {
        type: 'minor',
        message: 'minor commit',
      },
      {
        type: 'patch',
        message: 'patch commit',
      },
    ])
    .set('b1', [
      {
        type: 'initial',
        message: 'initial commit',
      },
    ])
    .set('e', [
      {
        type: 'major',
        message: 'major commit',
      },
    ])

  const { promptLog } = await import('../../src/prompt/prompt-log')

  promptLog(packages, gitBumps, prefixes)

  t.deepEquals(
    getSpyCalls(logSpy),
    [
      [''],
      ['ns/a → minor → v0.2.0'],
      ['* 🌱 minor commit\n* 🐞 patch commit'],
      [''],
      ['b1 → initial → v0.1.0'],
      ['* 🐣️ initial commit'],
      [''],
      ['c → minor → v1.1.0'],
      ['* ♻️ update dependencies `ns/a`'],
      [''],
      ['e → major → v1.0.0'],
      ['* 💥 major commit'],
      [''],
    ],
    'should log'
  )

  unmockRequire()
})

