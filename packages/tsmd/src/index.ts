import { readFile } from 'pifs'
import { isArray, isDefined } from 'tsfn'
import type { ArrowFunction, Identifier, Node, VariableStatement } from 'typescript'
import { forEachChild, createSourceFile, ScriptTarget, SyntaxKind } from 'typescript'

type TNode = Node & {
  jsDoc?: {
    comment?: string,
    tags?: {
      tagName: Identifier,
      name?: Identifier,
      comment?: string,
    }[],
    getText: () => string,
  }[],
}

type TTag = {
  tag: string,
  name?: string,
  comment?: string,
}

type TJSDoc = {
  comment?: string,
  tags?: TTag[],
}

const getJsDoc = (node: TNode): TJSDoc | null => {
  if (isArray(node.jsDoc)) {
    const result: TJSDoc = {}

    for (const doc of node.jsDoc) {
      if (isDefined(doc.comment)) {
        result.comment = doc.comment
      }

      if (isDefined(doc.tags)) {
        result.tags = []

        for (const tag of doc.tags) {
          const tagResult: TTag = {
            tag: tag.tagName.text,
          }

          if (isDefined(tag.name)) {
            tagResult.name = tag.name.text
          }

          if (isDefined(tag.comment)) {
            tagResult.comment = tag.comment
          }

          result.tags.push(tagResult)
        }
      }
    }

    return result
  }

  return null
}

export const tsToMd = async (filePath: string) => {
  const fileContent = await readFile(filePath, 'utf8')
  const sourceFile = createSourceFile(filePath, fileContent, ScriptTarget.ESNext, true)

  const visit = (node: TNode) => {
    switch (node.kind) {
      case SyntaxKind.VariableStatement: {
        const jsDoc = getJsDoc(node)

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
        const jsDoc = getJsDoc(node)

        if (jsDoc !== null) {
          console.log(jsDoc)
          console.log(node.getText())
        }
      }
    }

    forEachChild(node, visit)
  }

  visit(sourceFile)
}

export const main = async () => {
  await tsToMd('packages/tsmd/src/example.ts')
}
