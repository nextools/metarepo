import { readFile } from 'pifs'
import { isArray, isDefined } from 'tsfn'
import type { Identifier, Node, VariableStatement } from 'typescript'
import { forEachChild, createSourceFile, ScriptTarget, SyntaxKind } from 'typescript'

type TNode = Node & {
  jsDoc?: {
    comment?: string,
    tags?: {
      tagName: Identifier,
      name?: Identifier,
      comment?: string,
    }[],
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
          const variableName = (node as VariableStatement).declarationList.declarations[0].name.getText()

          console.log(variableName)
          console.log(jsDoc)
        }
      }

      // case SyntaxKind.PropertyAssignment: {

      // }
    }

    forEachChild(node, visit)
  }

  visit(sourceFile)
}

export const main = async () => {
  await tsToMd('packages/tsmd/src/example.ts')
}
