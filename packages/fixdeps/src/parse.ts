import { parse as babelParse } from '@babel/parser'
import type { File } from '@babel/types'

export const parse = (content: string): File => (
  babelParse(content, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'objectRestSpread',
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'asyncGenerators',
      'dynamicImport',
      'optionalCatchBinding',
      'throwExpressions',
      'bigInt',
      'optionalChaining',
      'nullishCoalescingOperator',
    ],
  })
)
