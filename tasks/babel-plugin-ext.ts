import { extname } from 'path'
import type { PluginObj } from '@babel/core'
import types from '@babel/types'
import type { StringLiteral } from '@babel/types'

const EXTENSION = '.js'

const isFixableExt = (specifier: string): boolean => {
  return specifier.startsWith('.') && extname(specifier).length === 0
}

const fixExt = (specifier: string): StringLiteral => {
  return types.stringLiteral(specifier + EXTENSION)
}

export const babelPluginExt: PluginObj = {
  visitor: {
    ImportDeclaration(path) {
      const specifier = path.node.source.value

      if (isFixableExt(specifier)) {
        path.node.source = fixExt(specifier)
      }
    },
    ExportAllDeclaration(path) {
      const specifier = path.node.source.value

      if (isFixableExt(specifier)) {
        path.node.source = fixExt(specifier)
      }
    },
    ExportNamedDeclaration(path) {
      if (types.isStringLiteral(path.node.source)) {
        const specifier = path.node.source.value

        if (isFixableExt(specifier)) {
          path.node.source = fixExt(specifier)
        }
      }
    },
    CallExpression(path) {
      if (path.node.callee.type === 'Import' && types.isStringLiteral(path.node.arguments[0])) {
        const specifier = path.node.arguments[0].value

        if (isFixableExt(specifier)) {
          path.node.arguments[0] = fixExt(specifier)
        }
      }
    },
  },
}
