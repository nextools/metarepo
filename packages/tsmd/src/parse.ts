import { readFile } from 'pifs'
import type { ArrowFunction, TypeAliasDeclaration, TypeLiteralNode, VariableStatement } from 'typescript'
import { forEachChild, createSourceFile, ScriptTarget, SyntaxKind } from 'typescript'
import { getDoc } from './get-doc'
import type { TNode, TResult } from './types'

export const parse = async (filePath: string): Promise<TResult[]> => {
  const fileContent = await readFile(filePath, 'utf8')
  const sourceFile = createSourceFile(filePath, fileContent, ScriptTarget.ESNext, true)
  const results: TResult[] = []

  const visit = (node: TNode) => {
    switch (node.kind) {
      case SyntaxKind.VariableStatement: {
        const doc = getDoc(node)

        if (doc !== null) {
          const varNode = node as VariableStatement
          const decl = varNode.declarationList.declarations[0]

          if (decl.initializer?.kind === SyntaxKind.ArrowFunction) {
            const variableName = decl.name.getText()
            const fnNode = decl.initializer as ArrowFunction

            const paramTypes = fnNode.parameters.map((param) => param.getText())
            const returnType = fnNode.type?.getText() ?? 'unknown'

            results.push({
              type: 'arrow-function',
              source: `const ${variableName}: (${paramTypes.join(', ')}) => ${returnType}`,
              doc,
            })
          }
        }

        return
      }

      case SyntaxKind.TypeAliasDeclaration: {
        const typeNode = node as TypeAliasDeclaration
        const doc = getDoc(typeNode)
        const typeNodeType = typeNode.type as TypeLiteralNode
        const hasInlineDoc = typeNodeType.kind === SyntaxKind.TypeLiteral && typeNodeType.members.some((member) => {
          return Array.isArray((member as TNode).jsDoc)
        })

        if (doc !== null || hasInlineDoc) {
          const typeName = typeNode.name.getText()
          const typeBody = typeNodeType.getText()

          const result: TResult = {
            type: 'type-alias',
            source: `type ${typeName} = ${typeBody}`,
          }

          if (doc !== null) {
            result.doc = doc
          }

          results.push(result)
        }

        return
      }
    }

    forEachChild(node, visit)
  }

  visit(sourceFile)

  return results
}
