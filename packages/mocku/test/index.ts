import Module from 'module'
import test from 'blue-tape'
import { mock, deleteFromCache } from '../src'

const _Module: any = Module
const originalLoad = _Module._load

test('mocku: `Module.load()` hook', (t) => {
  const unmock1 = mock('./fixtures/scoped/file', {
    './file2': {
      default: 'mock1',
    },
  })

  const mockedLoad = _Module._load

  const unmock2 = mock('./fixtures/scoped/file3', {
    './file2': {
      default: 'mock2',
    },
  })

  t.notEqual(
    originalLoad,
    _Module._load,
    'should be hooked'
  )

  t.equal(
    mockedLoad,
    _Module._load,
    'should be hooked only once'
  )

  unmock1()

  t.notEqual(
    originalLoad,
    _Module._load,
    'should be still hooked after first unmock'
  )

  unmock2()

  t.equal(
    originalLoad,
    _Module._load,
    'should be unhooked if there are no mocks'
  )

  t.end()
})

test('mocku: scoped file', async (t) => {
  const unmock = mock('./fixtures/scoped/file', {
    './file2': {
      default: 'mock',
    },
  })

  const { default: result1 } = await import('./fixtures/scoped/file')

  t.deepEqual(
    result1,
    'mock',
    'should mock'
  )

  unmock()

  const { default: result2 } = await import('./fixtures/scoped/file')

  t.deepEqual(
    result2,
    'file2',
    'should unmock'
  )
})

test('mocku: not scoped file: mock', async (t) => {
  const unmock = mock('./fixtures/scoped/file', {
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

  unmock()
})

test('mocku: modules', async (t) => {
  const unmock = mock('./fixtures/modules/file', {
    fs: {
      readFile: 'readFile',
    },
    '@babel/core': {
      transform: 'babel',
    },
  })

  const result1 = await import('./fixtures/modules/file')

  t.equal(
    result1.readFile,
    'readFile',
    'should mock builtin module'
  )

  t.equal(
    result1.transform,
    'babel',
    'should mock external module'
  )

  unmock()

  const result2 = await import('./fixtures/modules/file')

  t.equal(
    typeof result2.readFile,
    'function',
    'should unmock builtin module'
  )

  t.equal(
    typeof result2.transform,
    'function',
    'should unmock external module'
  )
})

test('mocku: modules: deleteFromCache', async (t) => {
  await import('./fixtures/file')

  const absolutePath = require.resolve('./fixtures/file')

  if (!Reflect.has(_Module._cache, absolutePath)) {
    t.fail('should not get there')
  }

  deleteFromCache(absolutePath)

  t.false(
    Reflect.has(_Module._cache, absolutePath),
    'should delete absolute path target from cache'
  )

  await import('./fixtures/file')

  if (!Reflect.has(_Module._cache, absolutePath)) {
    t.fail('should not get there')
  }

  deleteFromCache('./fixtures/file')

  t.false(
    Reflect.has(_Module._cache, absolutePath),
    'should delete absolute path target from cache'
  )

  if (!Reflect.has(_Module._cache, require.resolve('blue-tape'))) {
    t.fail('should not get there')
  }

  deleteFromCache('blue-tape')

  t.false(
    Reflect.has(_Module._cache, require.resolve('blue-tape')),
    'should delete module name target from cache'
  )
})
