import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import type { TPackageBumpMap } from '../../src/bump/types'
import type { TQuestionObj } from '../../src/prompt/types'
import type { TPackageMap } from '../../src/types'
import { makeTestPackages } from './make-test-packages'

test('makePrompt: yes', async (t) => {
  const logSpy = createSpy(() => {})
  const deleteSpy = createSpy(() => Promise.resolve())
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const readFileSpy = createSpy(() => Promise.resolve('{}'))
  const writeFileSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/prompt/make-prompt', {
    prompts: {
      default: () => Promise.resolve({ value: 'YES' }),
    },
    pifs: {
      readFile: readFileSpy,
      writeFile: writeFileSpy,
    },
    dleet: {
      default: deleteSpy,
    },
    spown: {
      spawnProcessChild: spawnChildProcessSpy,
    },
    '../../src/prompt/log': {
      log: logSpy,
    },
    '../../src/prompt/get-editor': {
      getEditor: () => Promise.resolve('editor'),
    },
  })

  const { makePrompt } = await import('../../src/prompt/make-prompt')

  const { packages, bumps, prevEditResult } = makeTestPackages()

  const res = await makePrompt(packages, bumps, prevEditResult)

  t.deepEquals(
    res,
    { type: 'YES' },
    'should resolve to yes type'
  )

  t.deepEquals(
    getSpyCalls(logSpy),
    [],
    'should not call log'
  )

  t.deepEquals(
    getSpyCalls(deleteSpy),
    [],
    'should not call delete'
  )

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [],
    'should not spawn child processes'
  )

  t.deepEquals(
    getSpyCalls(readFileSpy),
    [],
    'should not call readFile'
  )

  t.deepEquals(
    getSpyCalls(writeFileSpy),
    [],
    'should not call writeFile'
  )

  unmockRequire()
})

test('makePrompt: no', async (t) => {
  const logSpy = createSpy(() => {})
  const deleteSpy = createSpy(() => Promise.resolve())
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const readFileSpy = createSpy(() => Promise.resolve('{}'))
  const writeFileSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/prompt/make-prompt', {
    prompts: {
      default: () => Promise.resolve({ value: 'NO' }),
    },
    pifs: {
      readFile: readFileSpy,
      writeFile: writeFileSpy,
    },
    dleet: {
      default: deleteSpy,
    },
    spown: {
      spawnProcessChild: spawnChildProcessSpy,
    },
    '../../src/prompt/log': {
      log: logSpy,
    },
    '../../src/prompt/get-editor': {
      getEditor: () => Promise.resolve('editor'),
    },
  })

  const { makePrompt } = await import('../../src/prompt/make-prompt')

  const { packages, bumps, prevEditResult } = makeTestPackages()

  const res = await makePrompt(packages, bumps, prevEditResult)

  t.deepEquals(
    res,
    { type: 'NO' },
    'should return NO result'
  )

  t.deepEquals(
    getSpyCalls(logSpy),
    [],
    'should not call log'
  )

  t.deepEquals(
    getSpyCalls(deleteSpy),
    [],
    'should not call delete'
  )

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [],
    'should not spawn child processes'
  )

  t.deepEquals(
    getSpyCalls(readFileSpy),
    [],
    'should not call readFile'
  )

  t.deepEquals(
    getSpyCalls(writeFileSpy),
    [],
    'should not call writeFile'
  )

  unmockRequire()
})

test('makePrompt: edit - no changes to make', async (t) => {
  const logSpy = createSpy(() => {})
  const deleteSpy = createSpy(() => Promise.resolve())
  const spawnChildProcessSpy = createSpy(() => Promise.resolve('editor'))
  const readFileSpy = createSpy(() => Promise.resolve('{}'))
  const writeFileSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/prompt/make-prompt', {
    prompts: {
      default: () => Promise.resolve({ value: 'EDIT' }),
    },
    pifs: {
      readFile: readFileSpy,
      writeFile: writeFileSpy,
    },
    dleet: {
      default: deleteSpy,
    },
    spown: {
      spawnProcessChild: spawnChildProcessSpy,
    },
    '../../src/prompt/log': {
      log: logSpy,
    },
  })

  const { makePrompt } = await import('../../src/prompt/make-prompt')

  const packages: TPackageMap = new Map()

  packages
    .set('@ns/a', {
      dir: 'fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
      },
    })
    .set('b', {
      dir: 'fakes/b',
      json: {
        name: 'b',
        version: '0.1.0',
      },
    })
    .set('c', {
      dir: 'fakes/c',
      json: {
        name: 'c',
        version: '1.0.0',
      },
    })

  const bumps: TPackageBumpMap = new Map()

  bumps
    .set('@ns/a', {
      type: 'minor',
      version: '0.2.0',
      deps: null,
      devDeps: null,
    })
    .set('b', {
      type: 'minor',
      version: '0.2.0',
      deps: null,
      devDeps: {
        '@ns/a': '^0.2.0',
      },
    })
    .set('c', {
      version: '1.1.0',
      type: 'minor',
      deps: null,
      devDeps: {
        b: '^0.2.0',
      },
    })

  const res = await makePrompt(packages, bumps)

  t.deepEquals(
    res,
    {
      type: 'EDIT',
      dependencyBumpIgnoreMap: new Map(),
      initialTypeOverrideMap: new Map(),
      zeroBreakingTypeOverrideMap: new Map(),
    },
    'should return ignores'
  )

  t.deepEquals(
    getSpyCalls(logSpy),
    [
      [
        'No changes to make',
      ],
    ],
    'should not call log'
  )

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [],
    'should not call editor'
  )

  t.deepEquals(
    getSpyCalls(writeFileSpy),
    [],
    'should not call writeFile'
  )

  t.deepEquals(
    getSpyCalls(readFileSpy),
    [],
    'should not call readFile'
  )

  t.deepEquals(
    getSpyCalls(deleteSpy),
    [],
    'should not call delete'
  )

  unmockRequire()
})

test('makePrompt: edit - no changes made', async (t) => {
  const answer: TQuestionObj = {
    initialTypes: {},
    zeroBreakingTypes: {},
    dependencyBumps: {
      'dep-major': {
        'bump-major': 'major',
        'ignore-this': 'aaaa',
      },
      'dep-patch': {
        'bump-patch': 'patch',
      },
    },
  }

  const logSpy = createSpy(() => {})
  const deleteSpy = createSpy(() => Promise.resolve())
  const spawnChildProcessSpy = createSpy(() => Promise.resolve({ stdout: 'editor' }))
  const readFileSpy = createSpy(() => Promise.resolve(JSON.stringify(answer)))
  const writeFileSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/prompt/make-prompt', {
    prompts: {
      default: () => Promise.resolve({ value: 'EDIT' }),
    },
    pifs: {
      readFile: readFileSpy,
      writeFile: writeFileSpy,
    },
    dleet: {
      default: deleteSpy,
    },
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    '../../src/prompt/log': {
      log: logSpy,
    },
  })

  const { makePrompt } = await import('../../src/prompt/make-prompt')

  const { packages, bumps, prevEditResult } = makeTestPackages()

  const res = await makePrompt(packages, bumps, prevEditResult)

  t.deepEquals(
    res,
    {
      type: 'EDIT',
      ...prevEditResult,
    },
    'should return ignores'
  )

  t.deepEquals(
    getSpyCalls(logSpy),
    [],
    'should not call log'
  )

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'git config --get core.editor',
        { stderr: process.stderr },
      ],
      [
        'editor ./node_modules/@auto/.EDIT.json',
        { stdin: process.stdin, stdout: process.stdout, stderr: process.stderr },
      ],
    ],
    'should call editor'
  )

  t.deepEquals(
    getSpyCalls(writeFileSpy),
    [
      [
        './node_modules/@auto/.EDIT.json',
        JSON.stringify({
          initialTypes: {
            '@ns/init1': 'minor',
            '@ns/init2': 'major',
          },
          zeroBreakingTypes: {
            'bump-major': 'minor',
            'dep-major': 'major',
          },
          dependencyBumps: {
            'dep-major': {
              'bump-major': 'major',
            },
            'dep-patch': {
              'bump-patch': 'patch',
            },
          },
        }, null, 2),
      ],
    ],
    'should call writeFile'
  )

  t.deepEquals(
    getSpyCalls(readFileSpy),
    [
      [
        './node_modules/@auto/.EDIT.json',
        'utf8',
      ],
    ],
    'should call readFile'
  )

  t.deepEquals(
    getSpyCalls(deleteSpy),
    [
      [
        './node_modules/@auto/.EDIT.json',
      ],
    ],
    'should call delete'
  )

  unmockRequire()
})

test('makePrompt: edit - invalid answer json', async (t) => {
  const logSpy = createSpy(() => {})
  const deleteSpy = createSpy(() => Promise.resolve())
  const spawnChildProcessSpy = createSpy(() => Promise.resolve({ stdout: 'editor' }))
  const readFileSpy = createSpy(() => Promise.resolve('invalid'))
  const writeFileSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/prompt/make-prompt', {
    prompts: {
      default: () => Promise.resolve({ value: 'EDIT' }),
    },
    pifs: {
      readFile: readFileSpy,
      writeFile: writeFileSpy,
    },
    dleet: {
      default: deleteSpy,
    },
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    '../../src/prompt/log': {
      log: logSpy,
    },
  })

  const { makePrompt } = await import('../../src/prompt/make-prompt')

  const { packages, bumps, prevEditResult } = makeTestPackages()

  const res = await makePrompt(packages, bumps, prevEditResult)

  t.deepEquals(
    res,
    {
      type: 'EDIT',
      ...prevEditResult,
    },
    'should return ignores'
  )

  t.deepEquals(
    getSpyCalls(logSpy),
    [
      [
        'Error while parsing the answer',
      ],
    ],
    'should not call log'
  )

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'git config --get core.editor',
        { stderr: process.stderr },
      ],
      [
        'editor ./node_modules/@auto/.EDIT.json',
        { stdin: process.stdin, stdout: process.stdout, stderr: process.stderr },
      ],
    ],
    'should call editor'
  )

  t.deepEquals(
    getSpyCalls(writeFileSpy),
    [
      [
        './node_modules/@auto/.EDIT.json',
        JSON.stringify({
          initialTypes: {
            '@ns/init1': 'minor',
            '@ns/init2': 'major',
          },
          zeroBreakingTypes: {
            'bump-major': 'minor',
            'dep-major': 'major',
          },
          dependencyBumps: {
            'dep-major': {
              'bump-major': 'major',
            },
            'dep-patch': {
              'bump-patch': 'patch',
            },
          },
        }, null, 2),
      ],
    ],
    'should call writeFile'
  )

  t.deepEquals(
    getSpyCalls(readFileSpy),
    [
      [
        './node_modules/@auto/.EDIT.json',
        'utf8',
      ],
    ],
    'should call readFile'
  )

  t.deepEquals(
    getSpyCalls(deleteSpy),
    [
      [
        './node_modules/@auto/.EDIT.json',
      ],
    ],
    'should call delete'
  )

  unmockRequire()
})

test('makePrompt: edit - changes', async (t) => {
  const answer: TQuestionObj = {
    initialTypes: {
      '@ns/init1': 'patch',
      '@ns/init2': 'patch',
    },
    zeroBreakingTypes: {
      'bump-major': 'major',
      'dep-major': 'patch',
    },
    dependencyBumps: {
      'dep-major': {
        'bump-major': 'major',
      },
    },
  }

  const logSpy = createSpy(() => {})
  const deleteSpy = createSpy(() => Promise.resolve())
  const spawnChildProcessSpy = createSpy(() => Promise.resolve({ stdout: 'editor' }))
  const readFileSpy = createSpy(() => Promise.resolve(JSON.stringify(answer)))
  const writeFileSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../../src/prompt/make-prompt', {
    prompts: {
      default: () => Promise.resolve({ value: 'EDIT' }),
    },
    pifs: {
      readFile: readFileSpy,
      writeFile: writeFileSpy,
    },
    dleet: {
      default: deleteSpy,
    },
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    '../../src/prompt/log': {
      log: logSpy,
    },
  })

  const { makePrompt } = await import('../../src/prompt/make-prompt')

  const { packages, bumps, prevEditResult } = makeTestPackages()

  const res = await makePrompt(packages, bumps, prevEditResult)

  t.deepEquals(
    res,
    {
      type: 'EDIT',
      dependencyBumpIgnoreMap: new Map()
        .set('dep-major', ['bump-patch', 'non-existing'])
        .set('non-exisitng', ['a', 'b'])
        .set('dep-patch', ['bump-patch']),
      initialTypeOverrideMap: new Map()
        .set('@ns/init2', 'patch')
        .set('non-existing', 'major')
        .set('@ns/init1', 'patch'),
      zeroBreakingTypeOverrideMap: new Map()
        .set('dep-major', 'patch')
        .set('non-existing', 'major')
        .set('bump-major', 'major'),
    },
    'should return ignores'
  )

  t.deepEquals(
    getSpyCalls(logSpy),
    [],
    'should not call log'
  )

  t.deepEquals(
    getSpyCalls(spawnChildProcessSpy),
    [
      [
        'git config --get core.editor',
        { stderr: process.stderr },
      ],
      [
        'editor ./node_modules/@auto/.EDIT.json',
        { stdin: process.stdin, stdout: process.stdout, stderr: process.stderr },
      ],
    ],
    'should call editor'
  )

  t.deepEquals(
    getSpyCalls(writeFileSpy),
    [
      [
        './node_modules/@auto/.EDIT.json',
        JSON.stringify({
          initialTypes: {
            '@ns/init1': 'minor',
            '@ns/init2': 'major',
          },
          zeroBreakingTypes: {
            'bump-major': 'minor',
            'dep-major': 'major',
          },
          dependencyBumps: {
            'dep-major': {
              'bump-major': 'major',
            },
            'dep-patch': {
              'bump-patch': 'patch',
            },
          },
        }, null, 2),
      ],
    ],
    'should call writeFile'
  )

  t.deepEquals(
    getSpyCalls(readFileSpy),
    [
      [
        './node_modules/@auto/.EDIT.json',
        'utf8',
      ],
    ],
    'should call readFile'
  )

  t.deepEquals(
    getSpyCalls(deleteSpy),
    [
      [
        './node_modules/@auto/.EDIT.json',
      ],
    ],
    'should call delete'
  )

  unmockRequire()
})
