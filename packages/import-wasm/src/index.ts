import { promises as fsPromises, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import getCallerFile from 'get-caller-file'

const getCallerPath = () => {
  const result = getCallerFile(3)

  // in case of `--experimental-modules`
  // istanbul ignore next
  if (result.startsWith('file:///')) {
    return fileURLToPath(result)
  }

  return result
}

export const importWasmSync = <T = WebAssembly.Exports>(filePath: string, importObject?: WebAssembly.Imports): T => {
  const callerDir = dirname(getCallerPath())
  const fullFilePath = join(callerDir, filePath)
  const buf = readFileSync(fullFilePath)
  const compiled = new WebAssembly.Module(buf)
  const instance = new WebAssembly.Instance(compiled, importObject)

  return instance.exports as any
}

export const importWasm = async <T = WebAssembly.Exports>(filePath: string, importObject?: WebAssembly.Imports): Promise<T> => {
  const callerDir = dirname(getCallerPath())
  const fullFilePath = join(callerDir, filePath)
  const buf = await fsPromises.readFile(fullFilePath)
  const result = await WebAssembly.instantiate(buf, importObject)

  return result.instance.exports as any
}

// https://github.com/nodejs/node/issues/21130
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming
// export const importWasmResponse = async (response: Response, importObject: WebAssembly.Imports): Promise<WebAssembly.Exports> => {
//   const result = await WebAssembly.instantiateStreaming(response, importObject)
//
//   return result.instance.exports
// }
