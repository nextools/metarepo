import resolver from 'enhanced-resolve'

const resolve = resolver.create.sync({
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
  unsafeCache: true,
})

export default ({ types }) => ({
  visitor: {
    CallExpression(path, state) {
      if (path.node.callee.type === 'Import' && path.node.arguments[0].type === 'StringLiteral') {
        const specifier = path.node.arguments[0].value
        const resolvedSpecifier = resolve(state.opts.callerDir, specifier)

        path.node.arguments[0] = types.stringLiteral(resolvedSpecifier)
      }
    },
  },
})
