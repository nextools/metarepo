import path from 'path'
import getCallerFile from 'get-caller-file'
import { Module, uncacheKey } from '@mock/utils'

type TMocks = {
  [key: string]: any,
}

const originalLoad = Module._load
const originalCompile = Module.prototype._compile
const mocksMap = new Map<string, Set<TMocks>>()
const childrenMap = new Map<string, Set<string>>()

export const mockGlobal = (file: string, mocks: TMocks) => {
  let fullPath = file

  if (!path.isAbsolute(file)) {
    const callerDir = path.dirname(getCallerFile())
    const targetPath = path.resolve(callerDir, file)

    fullPath = require.resolve(targetPath)
  }

  if (!mocksMap.has(fullPath)) {
    mocksMap.set(fullPath, new Set())
  }

  mocksMap.get(fullPath)!.add(mocks)

  uncacheKey(fullPath)

  if (mocksMap.size === 1) {
    Module._load = (request, parent, isMain) => {
      const isDirectChild = parent.id === fullPath
      const isTransitiveChild = childrenMap.has(fullPath) && childrenMap.get(fullPath)!.has(parent.id)

      if ((isDirectChild || isTransitiveChild) && !Module.builtinModules.includes(request)) {
        let childFullPath = ''

        if (request.charAt(0) !== '.') {
          childFullPath = require.resolve(request)
        } else {
          const fullPathDir = path.dirname(parent.id)
          const targetPath = path.resolve(fullPathDir, request)

          childFullPath = require.resolve(targetPath)
        }

        if (!childrenMap.has(fullPath)) {
          childrenMap.set(fullPath, new Set())
        }

        childrenMap.get(fullPath)!.add(childFullPath)
      }

      return originalLoad(request, parent, isMain)
    }

    Module.prototype._compile = function(origContent, filename) {
      const isDirectTarget = filename === fullPath
      const isTransitiveTarget = childrenMap.has(fullPath) && childrenMap.get(fullPath)!.has(filename)
      let content = origContent

      if (isDirectTarget || isTransitiveTarget) {
        const mockSet = mocksMap.get(fullPath)!
        let injection = ''

        for (const mock of mockSet) {
          for (const [key, value] of Object.entries(mock)) {
            this.__mocku__ = {
              ...this.__mocku__,
              [key]: value,
            }

            injection += `${key}: module.__mocku__.${key},`
          }
        }

        content = `require('vm').runInContext(\`\n${origContent}\n\`, require('vm').createContext({ module, exports, require, __filename, __dirname, ...global, ${injection} global: { ...global, ${injection} } }), '${fullPath}');`
      }

      return originalCompile.call(this, content, filename)
    }
  }

  return () => {
    uncacheKey(fullPath)
    mocksMap.delete(fullPath)
    childrenMap.delete(fullPath)

    if (mocksMap.size === 0) {
      Module._load = originalLoad
      Module.prototype._compile = originalCompile
    }
  }
}
