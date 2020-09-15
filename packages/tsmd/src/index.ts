import { readFile } from 'pifs'
import type { ArrowFunction, TypeAliasDeclaration, TypeLiteralNode, VariableStatement } from 'typescript'
import { forEachChild, createSourceFile, ScriptTarget, SyntaxKind } from 'typescript'
import { getJSDoc } from './get-js-doc'
import type { TNode } from './types'

export const tsToMd = async (filePath: string) => {
  const fileContent = await readFile(filePath, 'utf8')
  const sourceFile = createSourceFile(filePath, fileContent, ScriptTarget.ESNext, true)

  const visit = (node: TNode) => {
    switch (node.kind) {
      case SyntaxKind.VariableStatement: {
        const jsDoc = getJSDoc(node)

        if (jsDoc !== null) {
          const varNode = node as VariableStatement
          const decl = varNode.declarationList.declarations[0]
          const variableName = decl.name.getText()

          if (decl.initializer?.kind === SyntaxKind.ArrowFunction) {
            const fnNode = decl.initializer as ArrowFunction
            const paramTypes = fnNode.parameters.map((param) => param.getText())
            const returnType = fnNode.type?.getText() ?? 'unknown'

            console.log(jsDoc)
            console.log(`const ${variableName}: (${paramTypes.join(', ')}) => ${returnType}`)
          }
        }

        return
      }

      case SyntaxKind.TypeAliasDeclaration: {
        const typeNode = node as TypeAliasDeclaration
        const jsDoc = getJSDoc(typeNode)
        const hasInlineDoc = (typeNode.type as TypeLiteralNode).members.some((member) => {
          return Array.isArray((member as TNode).jsDoc)
        })

        if (jsDoc !== null || hasInlineDoc) {
          console.log(jsDoc)
          console.log(node.getText())
        }

        return
      }
    }

    forEachChild(node, visit)
  }

  visit(sourceFile)
}
