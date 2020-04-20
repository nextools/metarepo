import path from 'path'
import _Module from 'module'
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

    const result = originalLoad(resolvedPath, parent, isMain)

    cache.set(cacheKey, result)

    return result
  }

  return originalLoad(request, parent, isMain)
}
