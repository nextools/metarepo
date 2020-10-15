import path from 'path'
import { Module, uncacheKey } from '@mock/utils'
import getCallerFile from 'get-caller-file'

type TMocks = {
  [key: string]: any,
}

const originalLoad = Module._load
const mocksMap = new Map<string, Set<Map<string, any>>>()
// https://nodejs.org/docs/latest-v12.x/api/modules.html#modulesModule_createrequire_filename
const createRequire = Module.createRequire ?? Module.createRequireFromPath

const getMocks = (module: NodeModule): Set<Map<string, any>> | null => {
  if (mocksMap.has(module.id)) {
    return mocksMap.get(module.id)!
  }

  if (module.parent !== null && typeof module.parent !== 'undefined') {
    return getMocks(module.parent)
  }

  return null
}

export const mockRequire = (file: string, mocks: TMocks): () => void => {
  const callerFile = getCallerFile()
  const callerDir = path.dirname(callerFile)
  let fullPath = file

  if (!path.isAbsolute(file)) {
    const targetPath = path.join(callerDir, file)

    fullPath = require.resolve(targetPath)
  }

  const resolve = createRequire(callerFile).resolve

  require(fullPath)
  uncacheKey(fullPath)

  const fileMocks = new Map<string, string>()

  for (const [request, value] of Object.entries(mocks)) {
    fileMocks.set(resolve(request), value)
  }

  if (!mocksMap.has(fullPath)) {
    mocksMap.set(fullPath, new Set())
  }

  mocksMap.get(fullPath)!.add(fileMocks)

  if (mocksMap.size === 1) {
    Module._load = (request, parent, isMain) => {
      const mocks = getMocks(parent)

      if (mocks !== null) {
        const requestKey = createRequire(parent.id).resolve(request)

        for (const mock of mocks) {
          if (mock.has(requestKey)) {
            const result = mock.get(requestKey)!

            if (!Module.builtinModules.includes(request)) {
              Reflect.defineProperty(result, '__esModule', {
                value: true,
              })
            }

            return result
          }
        }
      }

      return originalLoad(request, parent, isMain)
    }
  }

  return () => {
    uncacheKey(fullPath)
    mocksMap.delete(fullPath)

    if (mocksMap.size === 0) {
      Module._load = originalLoad
    }
  }
}
