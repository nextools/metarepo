import plugin, { StartDataFilesProps } from '@start/plugin'
import { Node, TransformationContext, SourceFile, StringLiteral } from 'typescript'

export type TBuildType = 'node' | 'web' | 'native'

export default (buildType: TBuildType) =>
  plugin<StartDataFilesProps, StartDataFilesProps>('transform-dts', ({ logMessage }) => async ({ files }) => {
    const { createPrinter, createSourceFile, createStringLiteral, ScriptTarget, ScriptKind, SyntaxKind, visitEachChild, visitNode, transform } = await import('typescript')
    const { getPackages } = await import('@auto/fs')

    const packages = await getPackages()

    const setLiteralSingleQuotes = (node: StringLiteral): StringLiteral => {
      (node as any).singleQuote = true

      return node
    }

    return {
      files: await Promise.all(files.map((file) => {
        const transformer = <T extends Node>(context: TransformationContext) => (rootNode: T) => {
          const visit = (node: Node): Node => {
            if (
              node.kind === SyntaxKind.StringLiteral &&
              (node.parent.kind === SyntaxKind.ImportDeclaration ||
              (node.parent.kind === SyntaxKind.LiteralType && node.parent.parent.kind === SyntaxKind.ImportType))
            ) {
              const nodeText = (node as StringLiteral).text

              if (Reflect.has(packages, nodeText)) {
                const pkg = packages[nodeText]

                if (buildType === 'web' && typeof pkg.json.browser === 'string') {
                  const path = `${nodeText}/web/`

                  logMessage(path)

                  return setLiteralSingleQuotes(createStringLiteral(path))
                }

                if (buildType === 'native' && typeof pkg.json['react-native'] === 'string') {
                  const path = `${nodeText}/native/`

                  logMessage(path)

                  return setLiteralSingleQuotes(createStringLiteral(path))
                }

                if (buildType === 'node' && typeof pkg.json.main === 'string') {
                  const path = `${nodeText}/node/`

                  logMessage(path)

                  return setLiteralSingleQuotes(createStringLiteral(path))
                }
              }
            }

            return visitEachChild(node, visit, context)
          }

          return visitNode(rootNode, visit)
        }

        const printer = createPrinter()
        const sourceFile = createSourceFile(
          file.path, file.data, ScriptTarget.ESNext, true, ScriptKind.TS
        )

        const result = transform(
          sourceFile, [transformer]
        )

        const transformedSourceFile = result.transformed[0]

        // console.log(printer.printFile(transformedSourceFile as SourceFile))

        return {
          ...file,
          data: printer.printFile(transformedSourceFile as SourceFile),
        }
      })),
    }
  })
