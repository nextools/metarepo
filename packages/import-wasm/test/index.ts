import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { importWasm, importWasmSync } from '..'

const WASM_FILE_PATH = './fixtures/rust/pkg/rust.wasm'

type TExports = {
  add: (a: number, b: number) => number,
  fromRust: (a: number) => void,
}

test('import-wasm: importWasm', async (t) => {
  const spy = createSpy(() => {})
  const importObject = {
    env: {
      fromJS: spy,
    },
  }
  const { add, fromRust } = await importWasm<TExports>(WASM_FILE_PATH, importObject)

  t.equal(
    add(2, 3),
    5,
    'add: should work'
  )

  fromRust(42)

  t.deepEqual(
    getSpyCalls(spy),
    [[42]],
    'fromRust: should work'
  )
})

test('import-wasm: importWasmSync', (t) => {
  const spy = createSpy(() => {})
  const importObject = {
    env: {
      fromJS: spy,
    },
  }
  const { add, fromRust } = importWasmSync<TExports>(WASM_FILE_PATH, importObject)

  t.equal(
    add(2, 3),
    5,
    'add: should work'
  )

  fromRust(42)

  t.deepEqual(
    getSpyCalls(spy),
    [[42]],
    'fromRust: should work'
  )

  t.end()
})
