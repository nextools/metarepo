const { accessSync } = require('fs')
const { join, dirname } = require('path')

const EXTENSION = '.ts'
const cache = new Map()

module.exports = ({ types }) => {
  const replaceSpecifier = (path, state) => {
    if (path.node.source !== null) {
      const specifier = path.node.source.value

      if (specifier.startsWith('.') && !specifier.endsWith(EXTENSION)) {
        const fullPath = join(dirname(state.filename), specifier) + EXTENSION

        if (cache.has(fullPath)) {
          const value = cache.get(fullPath)

          if (value !== null) {
            path.node.source = value
          }

          return
        }

        try {
          accessSync(fullPath)

          path.node.source = types.stringLiteral(specifier + EXTENSION)

          cache.set(fullPath, path.node.source)
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
    },
  })
}
