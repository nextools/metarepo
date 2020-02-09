# import-wasm

Async/sync helpers to import `.wasm` modules in Node.js without `--experimental-wasm-modules` flag which was added only in v12.3.0.

## Install

```sh
$ yarn add import-wasm
```

## Usage

```ts
importWasm<T = WebAssembly.Exports>(filePath: string, importObject?: WebAssembly.Imports) => Promise<T>

importWasmSync<T = WebAssembly.Exports>(filePath: string, importObject?: WebAssembly.Imports) => T
```

```ts
import { importWasm, importWasmSync } from 'import-wasm'

(async () => {
  const exports = await importWasm('./example.wasm')
})()

const exports = importWasmSync('./example.wasm')
```
