import t from '@babel/types'

const SPECIFIERS = ['funcom', 'iterama']

export const babelPluginShake = {
  visitor: {
    ImportDeclaration(path) {
      const specifierValue = path.node.source.value

      if (SPECIFIERS.includes(specifierValue) && t.isImportSpecifier(path.node.specifiers[0])) {
        path.replaceWithMultiple(
          path.node.specifiers.map((specifier) => {
            return t.importDeclaration(
              [t.importSpecifier(
                t.identifier(specifier.local.name),
                t.identifier(specifier.imported.name)
              )],
              t.stringLiteral(`${specifierValue}/${specifier.imported.name}`)
            )
          })
        )
      }
    },
    VariableDeclaration(path) {
      if (
        path.node.declarations.length === 1 &&
        t.isAwaitExpression(path.node.declarations[0].init) &&
        t.isObjectPattern(path.node.declarations[0].id) &&
        t.isCallExpression(path.node.declarations[0].init.argument) &&
        t.isImport(path.node.declarations[0].init.argument.callee) &&
        path.node.declarations[0].init.argument.arguments.length === 1 &&
        t.isStringLiteral(path.node.declarations[0].init.argument.arguments[0])
      ) {
        const specifier = path.node.declarations[0].init.argument.arguments[0].value

        if (SPECIFIERS.includes(specifier)) {
          path.replaceWithMultiple(
            path.node.declarations[0].id.properties.map((prop) => {
              return t.variableDeclaration(
                'const',
                [t.variableDeclarator(
                  t.objectPattern([
                    t.objectProperty(
                      t.identifier(prop.key.name),
                      t.identifier(prop.value.name)
                    ),
                  ]),
                  t.awaitExpression(
                    t.callExpression(
                      t.import(),
                      [t.stringLiteral(`${specifier}/${prop.key.name}`)]
                    )
                  )
                )]
              )
            })
          )
        }
      }
    },
  },
}
