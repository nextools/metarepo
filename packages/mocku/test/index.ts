import Module from 'module'
import test from 'blue-tape'
import { mock, unmock, deleteFromCache } from '../src'

const _Module: any = Module
const originalLoad = _Module._load

test('mocku: Module: hook', (t) => {
  mock('./fixtures/scoped/file', {
    './file2': {
      default: 'mock1',
    },
  })

  const mockedLoad = _Module._load

  mock('./fixtures/scoped/file3', {
    './file2': {
      default: 'mock2',
    },
  })

  t.notEqual(
    originalLoad,
    _Module._load,
    'Module._load should be hooked'
  )

  t.equal(
    mockedLoad,
    _Module._load,
    'Module._load should be hooked only once'
  )

  t.end()
})

test('mocku: Module: unhook', (t) => {
  unmock('./fixtures/scoped/file')

  t.notEqual(
    originalLoad,
    _Module._load,
    'Module._load should be still hooked after first unmock'
  )

  unmock('./fixtures/scoped/file3')

  t.equal(
    originalLoad,
    _Module._load,
    'Module._load should be unhooked if there are no mocks'
  )

  t.end()
})

test('mocku: scoped file: mock', async (t) => {
  mock('./fixtures/scoped/file', {
    './file2': {
      default: 'mock',
    },
  })

  const { default: result } = await import('./fixtures/scoped/file')

  t.deepEqual(
    result,
    'mock',
    'should mock'
  )
})

test('mocku: scoped file: unmock', async (t) => {
  unmock('./fixtures/scoped/file')

  const { default: result } = await import('./fixtures/scoped/file')

  t.deepEqual(
    result,
    'file2',
    'should unmock'
  )
})

test('mocku: not scoped file: mock', async (t) => {
  mock('./fixtures/scoped/file', {
    './file2': {
      default: 'mock',
    },
  })

  const { default: result } = await import('./fixtures/scoped/file3')

  t.deepEqual(
    result,
    'file2',
    'should not mock'
  )

  unmock('./fixtures/scoped/file')
})

test('mocku: modules: mock', async (t) => {
  mock('./fixtures/modules/file', {
    fs: {
      readFile: 'readFile',
    },
    '@babel/core': {
      transform: 'babel',
    },
  })

  const { readFile, transform } = await import('./fixtures/modules/file')

  t.equal(
    readFile,
    'readFile',
    'should mock builtin module'
  )

  t.equal(
    transform,
    'babel',
    'should mock external module'
  )
})

test('mocku: modules: unmock', async (t) => {
  unmock('./fixtures/modules/file')

  const { readFile, transform } = await import('./fixtures/modules/file')

  t.equal(
    typeof readFile,
    'function',
    'should unmock builtin module'
  )

  t.equal(
    typeof transform,
    'function',
    'should unmock external module'
  )
})

test('mocku: modules: deleteFromCache', (t) => {
  t.true(
    Reflect.has(_Module._cache, require.resolve('blue-tape')),
    'check for cache'
  )

  deleteFromCache('blue-tape')

  t.false(
    Reflect.has(_Module._cache, require.resolve('blue-tape')),
    'should delete from cache'
  )

  t.end()
})
