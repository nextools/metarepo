import resolveFrom from 'resolve-from'

export default ({ types }) => ({
  visitor: {
    CallExpression(path, state) {
      if (path.node.callee.type === 'Import' && path.node.arguments[0].type === 'StringLiteral') {
        const specifier = path.node.arguments[0].value
        const resolvedSpecifier = resolveFrom(state.opts.callerDir, specifier)

        path.node.arguments[0] = types.stringLiteral(resolvedSpecifier)
      }
    },
  },
})
