import Module from 'module'
import test from 'tape'
import { mockGlobal } from '../src'

const _Module = Module as any
const originalLoad = _Module._load
const originalCompile = _Module.prototype._compile
const originalConsoleLog = console.log
const originalGlobalConsoleLog = global.console.log

test('mocku: `Module._load()` hook', (t) => {
  const unmockGlobal1 = mockGlobal('./fixtures/global-scope', {
    console: {
      log: () => 'log',
    },
  })

  const mockedLoad = _Module._load

  const unmockGlobal2 = mockGlobal('./fixtures/global-scope-nested', {
    console: {
      log: () => 'log',
    },
  })

  t.notEqual(
    originalLoad,
    _Module._load,
    'should hook'
  )

  t.equal(
    mockedLoad,
    _Module._load,
    'should hook only once'
  )

  unmockGlobal1()

  t.notEqual(
    originalLoad,
    _Module._load,
    'should still hook after first unmock'
  )

  unmockGlobal2()

  t.equal(
    originalLoad,
    _Module._load,
    'should unhook f there are no mocks'
  )

  t.end()
})

test('mocku: `Module.prototype._compile()` hook', (t) => {
  const unmockGlobal1 = mockGlobal('./fixtures/global-scope', {
    console: {
      log: () => 'log',
    },
  })

  const mockedCompile = _Module.prototype._compile

  const unmockGlobal2 = mockGlobal('./fixtures/global-scope-nested', {
    console: {
      log: () => 'log',
    },
  })

  t.notEqual(
    originalCompile,
    _Module.prototype._compile,
    'should hook'
  )

  t.equal(
    mockedCompile,
    _Module.prototype._compile,
    'should hook only once'
  )

  unmockGlobal1()

  t.notEqual(
    originalCompile,
    _Module.prototype._compile,
    'should still hook after first unmock'
  )

  unmockGlobal2()

  t.equal(
    originalCompile,
    _Module.prototype._compile,
    'should unhook if there are no mocks'
  )

  t.end()
})

test('mocku-global: global scope', async (t) => {
  const unmockGlobal = mockGlobal('./fixtures/global-scope', {
    console: {
      log: () => 'log',
    },
  })

  const imported1 = await import('./fixtures/global-scope')

  t.equal(
    imported1.consoleLog(),
    'log',
    'should mock global scope'
  )

  t.equal(
    originalConsoleLog,
    console.log,
    'should not leak mock to upper scopes'
  )

  t.equal(
    imported1.timeout,
    setTimeout,
    'should leave not mocked globals as is'
  )

  const notMocked = await import('./fixtures/not-mocked')

  t.equal(
    notMocked.consoleLog,
    console.log,
    'should leave not mocked files as is'
  )

  unmockGlobal()

  const imported2 = await import('./fixtures/global-scope')

  t.equal(
    imported2.consoleLog,
    console.log,
    'should unmock'
  )
})

test('mocku-global: global scope + double mock', async (t) => {
  const unmockGlobal1 = mockGlobal('./fixtures/global-scope', {
    console: {
      log: () => 'log',
    },
  })
  const unmockGlobal2 = mockGlobal('./fixtures/global-scope', {
    setTimeout: 'timeout',
  })

  const imported1 = await import('./fixtures/global-scope')

  t.equal(
    imported1.consoleLog(),
    'log',
    'should mock global scope: first mock'
  )

  t.equal(
    imported1.timeout,
    'timeout',
    'should mock global scope: second mock'
  )

  unmockGlobal1()
  unmockGlobal2()

  const imported2 = await import('./fixtures/global-scope')

  t.equal(
    imported2.consoleLog,
    console.log,
    'should unmock: first mock'
  )

  t.equal(
    imported2.timeout,
    setTimeout,
    'should unmock: second mock'
  )
})

test('mocku-global: global scope + nested', async (t) => {
  const unmockGlobal = mockGlobal('./fixtures/global-scope-nested', {
    setTimeout: 'timeout',
    process: {
      pid: 666,
    },
  })

  const imported1 = await import('./fixtures/global-scope-nested')

  t.equal(
    imported1.timeout,
    'timeout',
    'should mock global scope in nested module'
  )

  t.equal(
    imported1.pid,
    666,
    'should mock global scope in nested module of a nested module'
  )

  t.equal(
    imported1.interval,
    setInterval,
    'should leave not mocked globals in nested module as is'
  )

  unmockGlobal()

  const imported2 = await import('./fixtures/global-scope')

  t.equal(
    imported2.timeout,
    setTimeout,
    'should unmock'
  )
})

test('mocku-global: global scope + absolute path target', async (t) => {
  const absolutePath = require.resolve('./fixtures/global-scope')

  const unmockGlobal = mockGlobal(absolutePath, {
    setTimeout: 'timeout',
  })

  const imported1 = await import(absolutePath)

  t.equal(
    imported1.timeout,
    'timeout',
    'should mock global scope'
  )

  unmockGlobal()

  const imported2 = await import(absolutePath)

  t.equal(
    imported2.timeout,
    setTimeout,
    'should unmock'
  )
})

test('mocku-global: global object', async (t) => {
  const unmockGlobal = mockGlobal('./fixtures/global-object', {
    console: {
      log: () => 'log',
    },
  })

  const imported1 = await import('./fixtures/global-object')

  t.equal(
    imported1.consoleLog(),
    'log',
    'should mock global object'
  )

  t.equal(
    originalGlobalConsoleLog,
    global.console.log,
    'should not leak mock to upper scopes'
  )

  t.equal(
    imported1.timeout,
    setTimeout,
    'should leave not mocked globals as is'
  )

  const notMocked = await import('./fixtures/not-mocked')

  t.equal(
    notMocked.consoleLog,
    console.log,
    'should leave not mocked files as is'
  )

  unmockGlobal()

  const imported2 = await import('./fixtures/global-object')

  t.equal(
    imported2.consoleLog,
    console.log,
    'should unmock'
  )
})

test('mocku-global: import external module', async (t) => {
  const unmockGlobal = mockGlobal('./fixtures/external-module', {
    setTimeout: 'timeout',
  })

  const imported1 = await import('./fixtures/external-module')

  t.equal(
    imported1.timeout,
    'timeout',
    'should mock global scope'
  )

  unmockGlobal()

  const imported2 = await import('./fixtures/external-module')

  t.equal(
    imported2.timeout,
    setTimeout,
    'should unmock'
  )
})

test('mocku-global: import absolute path', async (t) => {
  const unmockGlobal = mockGlobal('./fixtures/absolute-path', {
    setTimeout: 'timeout',
  })

  const imported1 = await import('./fixtures/absolute-path')

  t.equal(
    imported1.timeout,
    'timeout',
    'should mock global scope'
  )

  unmockGlobal()

  const imported2 = await import('./fixtures/absolute-path')

  t.equal(
    imported2.timeout,
    setTimeout,
    'should unmock'
  )
})
