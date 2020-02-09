import test from 'blue-tape'
import { importWasm, importWasmSync } from '..'

type TExports = {
  add: (a: number, b: number) => number,
}

test('import-wasm: importWasm', async (t) => {
  const { add } = await importWasm<TExports>('./fixtures/add.wasm')

  t.equal(
    add(2, 3),
    5,
    'should work'
  )
})

test('import-wasm: importWasmSync', (t) => {
  const { add } = importWasmSync<TExports>('./fixtures/add.wasm')

  t.equal(
    add(2, 3),
    5,
    'should work'
  )

  t.end()
})
