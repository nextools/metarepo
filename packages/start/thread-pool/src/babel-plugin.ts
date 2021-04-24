import Module from 'module'
import type { PluginObj } from '@babel/core'
import types from '@babel/types'
import resolver from 'enhanced-resolve'

type TOptions = {
  callerDir: string,
}

const resolve = resolver.create.sync({
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
  unsafeCache: true,
})

export const babelPluginImports: PluginObj = {
  visitor: {
    CallExpression(path, state) {
      if (path.node.callee.type === 'Import' && path.node.arguments[0].type === 'StringLiteral') {
        const specifier = path.node.arguments[0].value

        if (!Module.builtinModules.includes(specifier)) {
          const opts = state.opts as TOptions
          const resolvedSpecifier = resolve(opts.callerDir, specifier)

          if (resolvedSpecifier !== false) {
            path.node.arguments[0] = types.stringLiteral(resolvedSpecifier)
          }
        }
      }
    },
  },
}
