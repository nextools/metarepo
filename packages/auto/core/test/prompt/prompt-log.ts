import test from 'tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { prefixes } from '../prefixes'
import { TPackageBumpMap } from '../../src/bump/types'
import { TGitMessageMap } from '../../src/types'

test('promptLog', async (t) => {
  const logSpy = createSpy(() => {})
  const unmock = mock('../../src/prompt/prompt-log', {
    './log': {
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
    .set('b', {
      type: 'initial',
      version: '0.1.0',
      deps: {
        '@ns/a': '^0.2.0',
      },
      devDeps: null,
    })
    .set('c', {
      version: '1.1.0',
      type: 'minor',
      deps: {
        b: '^0.1.0',
        a: '^0.2.0',
      },
      devDeps: null,
    })
    .set('d', {
      version: null,
      type: null,
      deps: null,
      devDeps: {
        b: '^0.1.0',
      },
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
    .set('b', [
      {
        type: 'initial',
        message: 'initial commit',
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
      ['b → initial → v0.1.0'],
      ['* 🐣️ initial commit'],
      [''],
      ['c → minor → v1.1.0'],
      ['* ♻️ update dependencies `a`'],
      [''],
    ],
    'should log'
  )

  unmock()
})
