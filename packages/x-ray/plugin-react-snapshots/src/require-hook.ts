import _Module from 'module'
import path from 'path'
import resolver from 'enhanced-resolve'

type TModule = {
  _load: (request: string, parent: NodeModule, isMain: boolean) => any,
  builtinModules: string[],
}

const Module = _Module as unknown as TModule

const originalLoad = Module._load
const cache = new Map()

const resolve = resolver.create.sync({
  mainFields: ['browser', 'main'],
  extensions: [
    '.web.ts',
    '.ts',
    '.web.tsx',
    '.tsx',
    '.web.js',
    '.js',
    '.web.jsx',
    '.jsx',
    '.json',
  ],
  unsafeCache: true,
})

Module._load = (request, parent, isMain) => {
  if (!request.startsWith('.') && !path.isAbsolute(request) && !Module.builtinModules.includes(request)) {
    const callerDir = path.dirname(parent.filename)
    const cacheKey = `${callerDir}@${request}`

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const resolvedPath = resolve(callerDir, request)

    if (resolvedPath === false) {
      throw new Error(`Unable to resolve \`${request}\` from \`${callerDir}\` dir`)
    }

    const result = originalLoad(resolvedPath, parent, isMain)

    cache.set(cacheKey, result)

    return result
  }

  return originalLoad(request, parent, isMain)
}
