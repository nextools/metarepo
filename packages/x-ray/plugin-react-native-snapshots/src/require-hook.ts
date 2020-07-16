import _Module from 'module'
import path from 'path'
import resolver from 'enhanced-resolve'
import { ReactNativeMocks } from './react-native-mocks'
import { ReactNativeSvgMocks } from './react-native-svg-mocks'
import { ReactNativeSafeModulesMocks } from './react-native-safe-modules-mocks'

type TModule = {
  _load: (request: string, parent: NodeModule, isMain: boolean) => any,
  builtinModules: string[],
}

const Module = _Module as unknown as TModule

const originalLoad = Module._load
const cache = new Map()

const resolve = resolver.create.sync({
  mainFields: ['react-native', 'main'],
  extensions: [
    '.ios.ts',
    '.android.ts',
    '.native.ts',
    '.ts',
    '.ios.tsx',
    '.android.tsx',
    '.native.tsx',
    '.tsx',
    '.ios.js',
    '.android.js',
    '.native.js',
    '.js',
    '.ios.jsx',
    '.android.jsx',
    '.native.jsx',
    '.jsx',
    '.json',
  ],
  unsafeCache: true,
})

Module._load = (request, parent, isMain) => {
  if (request === 'react-native') {
    return ReactNativeMocks
  }

  if (request === 'react-native-svg') {
    return ReactNativeSvgMocks
  }

  if (request === 'react-native-safe-modules') {
    return ReactNativeSafeModulesMocks
  }

  if (!path.isAbsolute(request) && !Module.builtinModules.includes(request)) {
    const callerDir = path.dirname(parent.filename)
    const cacheKey = `${callerDir}@${request}`

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const resolvedPath = resolve(callerDir, request)

    const result = originalLoad(resolvedPath, parent, isMain)

    cache.set(cacheKey, result)

    return result
  }

  return originalLoad(request, parent, isMain)
}
