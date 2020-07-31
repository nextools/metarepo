const { ESLintUtils } = require('@typescript-eslint/experimental-utils')

module.exports = {
  rules: {
    'type-only-import-export': {
      create(context) {
        const parserServices = ESLintUtils.getParserServices(context)
        const checker = parserServices.program.getTypeChecker()

        return {
          'ImportSpecifier, ExportSpecifier': (esTreeNode) => {
            const tsNode = parserServices.esTreeNodeToTSNodeMap.get(esTreeNode)
            const isTypeOnlyImportExport = tsNode.parent.parent.isTypeOnly
            const nodeType = checker.getTypeAtLocation(tsNode)
            const symbolType = checker.getDeclaredTypeOfSymbol(tsNode.symbol)

            if (!isTypeOnlyImportExport && nodeType.flags === 1 && symbolType.flags > 1) {
              context.report({
                node: esTreeNode,
                message: 'type-only import/export must be used',
              })
            }
          },
        }
      },
    },
  },
}
