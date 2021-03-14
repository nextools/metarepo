const { accessSync } = require('fs')
const { join, dirname } = require('path')

const EXTENSION = '.ts'
const cache = new Map()

module.exports = ({ types }) => {
  const replaceSpecifier = ({ node }, state) => {
    if (node.source !== null) {
      const specifier = node.source.value

      if (specifier.startsWith('.') && !specifier.endsWith(EXTENSION)) {
        const fullPath = join(dirname(state.filename), specifier) + EXTENSION

        if (cache.has(fullPath)) {
          const value = cache.get(fullPath)

          if (value !== null) {
            node.source = value
          }

          return
        }

        try {
          accessSync(fullPath)

          node.source = types.stringLiteral(specifier + EXTENSION)

          cache.set(fullPath, node.source)
        } catch {
          cache.set(fullPath, null)
        }
      }
    }
  }

  return ({
    visitor: {
      ImportDeclaration: replaceSpecifier,
      ExportAllDeclaration: replaceSpecifier,
      ExportNamedDeclaration: replaceSpecifier,
      CallExpression({ node }, state) {
        if (node.callee.type === 'Import' && node.arguments[0].type === 'StringLiteral') {
          const specifier = node.arguments[0].value

          if (specifier.startsWith('.') && !specifier.endsWith(EXTENSION)) {
            const fullPath = join(dirname(state.filename), specifier) + EXTENSION

            if (cache.has(fullPath)) {
              const value = cache.get(fullPath)

              if (value !== null) {
                node.arguments[0] = value
              }

              return
            }

            try {
              accessSync(fullPath)

              node.arguments[0] = types.stringLiteral(specifier + EXTENSION)

              cache.set(fullPath, node.arguments[0])
            } catch {
              cache.set(fullPath, null)
            }
          }
        }
      },
    },
  })
}
