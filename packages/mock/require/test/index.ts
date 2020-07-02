import Module from 'module'
import { deleteFromCache } from '@mock/utils'
import test from 'tape'
import { mockRequire } from '../src'

const _Module = Module as any
const originalLoad = _Module._load

test('mock/import: relative target + relative mock', async (t) => {
  const unmockRequire = mockRequire('./fixtures/relative', {
    './fixtures/get-data': {
      getData: () => 'fake data',
    },
  })

  let imported = await import('./fixtures/relative')

  t.equal(
    imported.getData(),
    'fake data',
    'should mock'
  )

  unmockRequire()

  imported = await import('./fixtures/relative')

  t.equal(
    imported.getData(),
    'real data',
    'should unmock'
  )

  deleteFromCache('./fixtures/relative')
})

test('mock/import: relative target + relative mock + nested', async (t) => {
  const unmockRequire = mockRequire('./fixtures/relative-nested', {
    './fixtures/get-data': {
      getData: () => 'fake data',
    },
  })

  let imported = await import('./fixtures/relative-nested')

  t.equal(
    imported.getData(),
    'fake data',
    'should mock'
  )

  unmockRequire()

  imported = await import('./fixtures/relative-nested')

  t.equal(
    imported.getData(),
    'real data',
    'should unmock'
  )

  deleteFromCache('./fixtures/relative-nested')
})

test('mock/import: relative target + absolute mock', async (t) => {
  const absoluteMockPath = require.resolve('./fixtures/get-data')
  const unmockRequire = mockRequire('./fixtures/relative', {
    [absoluteMockPath]: {
      getData: () => 'fake data',
    },
  })

  let imported = await import('./fixtures/relative')

  t.equal(
    imported.getData(),
    'fake data',
    'should mock'
  )

  unmockRequire()

  imported = await import('./fixtures/relative')

  t.equal(
    imported.getData(),
    'real data',
    'should unmock'
  )

  deleteFromCache('./fixtures/relative')
})

test('mock/import: absolute target + absolute mock', async (t) => {
  const absoluteTargetPath = require.resolve('./fixtures/relative')
  const absoluteMockPath = require.resolve('./fixtures/get-data')
  const unmockRequire = mockRequire(absoluteTargetPath, {
    [absoluteMockPath]: {
      getData: () => 'fake data',
    },
  })

  let imported = await import('./fixtures/relative')

  t.equal(
    imported.getData(),
    'fake data',
    'should mock'
  )

  unmockRequire()

  imported = await import('./fixtures/relative')

  t.equal(
    imported.getData(),
    'real data',
    'should unmock'
  )

  deleteFromCache('./fixtures/relative')
})

test('mock/import: relative target + absolute mock + nested', async (t) => {
  const absoluteMockPath = require.resolve('./fixtures/get-data')
  const unmockRequire = mockRequire('./fixtures/relative-nested', {
    [absoluteMockPath]: {
      getData: () => 'fake data',
    },
  })

  let imported = await import('./fixtures/relative-nested')

  t.equal(
    imported.getData(),
    'fake data',
    'should mock'
  )

  unmockRequire()

  imported = await import('./fixtures/relative-nested')

  t.equal(
    imported.getData(),
    'real data',
    'should unmock'
  )

  deleteFromCache('./fixtures/relative-nested')
})

test('mock/import: relative target + builtin mock', async (t) => {
  const unmockRequire = mockRequire('./fixtures/builtin', {
    os: {
      cpus: () => [],
    },
  })

  let imported = await import('./fixtures/builtin')

  t.deepEqual(
    imported.cpus(),
    [],
    'should mock'
  )

  unmockRequire()

  imported = await import('./fixtures/builtin')

  t.true(
    imported.cpus().length > 0,
    'should unmock'
  )

  deleteFromCache('./fixtures/builtin')
})

test('mock/import: relative target + module mock', async (t) => {
  const unmockRequire = mockRequire('./fixtures/module', {
    'get-caller-file': {
      default: 'mock',
    },
  })

  let imported = await import('./fixtures/module')

  t.deepEqual(
    imported.default,
    'mock',
    'should mock'
  )

  unmockRequire()

  imported = await import('./fixtures/module')

  t.true(
    typeof imported.default === 'function',
    'should unmock'
  )

  deleteFromCache('./fixtures/module')
})

test('mock/import: relative target + double mock for the same relative target file', async (t) => {
  const unmockRequire1 = mockRequire('./fixtures/double', {
    './fixtures/get-data': {
      getData: () => 'fake data',
    },
  })

  const unmockRequire2 = mockRequire('./fixtures/double', {
    os: {
      cpus: () => [],
    },
  })

  let imported = await import('./fixtures/double')

  t.equal(
    imported.getData(),
    'fake data',
    'should mock using first mockRequire'
  )

  t.deepEqual(
    imported.cpus(),
    [],
    'should mock using second mockRequire'
  )

  unmockRequire1()
  unmockRequire2()

  imported = await import('./fixtures/double')

  t.equal(
    imported.getData(),
    'real data',
    'should unmock from first mockRequire'
  )

  t.true(
    imported.cpus().length > 0,
    'should unmock from second mockRequire'
  )

  deleteFromCache('./fixtures/double')
})

test('mock/import: `Module.load()` hook', (t) => {
  const unmockRequire1 = mockRequire('./fixtures/relative', {
    './fixtures/get-data': {
      getData: () => 'fake data',
    },
  })

  const mockedLoad = _Module._load

  const unmockRequire2 = mockRequire('./fixtures/builtin', {
    os: {
      cpus: () => [],
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

  unmockRequire1()

  t.notEqual(
    originalLoad,
    _Module._load,
    'should be still hooked after first unmock'
  )

  unmockRequire2()

  t.equal(
    originalLoad,
    _Module._load,
    'should be unhooked if there are no mocks'
  )

  t.end()
})
