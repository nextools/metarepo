import { parse as babelParse } from '@babel/parser'
import { File } from '@babel/types'

export const parse = (content: string): File => (
  babelParse(content, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'objectRestSpread',
      'classProperties',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'asyncGenerators',
      'dynamicImport',
      'optionalCatchBinding',
      'throwExpressions',
      'bigInt',
    ],
  })
)
