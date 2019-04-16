import {
  Node,
  isExportAllDeclaration,
  isExportNamedDeclaration,
  isCallExpression,
  isIdentifier,
  isImport,
  isImportDeclaration,
  isStringLiteral,
} from '@babel/types'
import { isString } from './is-string'

const detectExportDeclaration = (node: Node): string | null => {
  if (isExportAllDeclaration(node) || isExportNamedDeclaration(node)) {
    const source = node.source

    if (source !== null) {
      return source.value
    }
  }

  return null
}

const detectImportCallExpression = (node: Node): string | null => {
  if (isCallExpression(node)) {
    const callee = node.callee

    if (isImport(callee)) {
      const stringArg = node.arguments[0]

      if (isStringLiteral(stringArg)) {
        return stringArg.value
      }
    }
  }

  return null
}

const detectImportDeclaration = (node: Node): string | null => {
  if (isImportDeclaration(node)) {
    return node.source.value
  }

  return null
}

const detectRequireCallExpression = (node: Node): string | null => {
  if (isCallExpression(node)) {
    const callee = node.callee

    if (isIdentifier(callee) && callee.name === 'require') {
      const stringArg = node.arguments[0]

      if (isStringLiteral(stringArg)) {
        return stringArg.value
      }
    }
  }

  return null
}

// const detectRequireResolveCallExpression = (node: Node): string | null => {
//   if (isCallExpression(node)) {
//     const callee = node.callee

//     if (isMemberExpression(callee)) {
//       const isCalleeObjectName = isIdentifier(callee.object) && callee.object.name === 'require'
//       const isCalleeProperty = isIdentifier(callee.property) && callee.property.name === 'resolve'

//       if (isCalleeObjectName && isCalleeProperty) {
//         const stringArg = node.arguments[0]

//         if (isStringLiteral(stringArg)) {
//           return stringArg.value
//         }
//       }
//     }
//   }

//   return null
// }

const detectors = [
  detectImportDeclaration,
  detectImportCallExpression,
  detectExportDeclaration,
  detectRequireCallExpression,
]

export const detect = (node: Node): string | null => {
  for (const detector of detectors) {
    const value = detector(node)

    if (isString(value) && value.length > 0) {
      return value
    }
  }

  return null
}
