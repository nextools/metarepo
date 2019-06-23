import { ReactElement } from 'react'
import serializeReactTree from '@x-ray/serialize-react-tree'
import { TSerializedResult } from '@x-ray/serialize-react-tree/src/types'
import { TExportsMap } from './types'

const wrapComponent = (data: TSerializedResult, exportsMap: TExportsMap) => {
  const importMapKeys = Object.keys(exportsMap)
  const outputExportsMap: TExportsMap = {}
  const createExportsEntry = (pkgName: string) => {
    if (!outputExportsMap[pkgName]) {
      outputExportsMap[pkgName] = {
        exports: [],
      }
    }
  }

  for (const primitive of data.primitives) {
    let primitiveWasAdded = false

    for (const pkgName of importMapKeys) {
      const pkg = exportsMap[pkgName]

      if (pkg.exports.includes(primitive)) {
        createExportsEntry(pkgName)
        outputExportsMap[pkgName].exports.push(primitive)
        primitiveWasAdded = true

        break
      }

      if (pkg.default === primitive) {
        createExportsEntry(pkgName)
        outputExportsMap[pkgName].default = primitive
        primitiveWasAdded = true

        break
      }
    }

    if (!primitiveWasAdded) {
      createExportsEntry('react-native')
      outputExportsMap['react-native'].exports.push(primitive)
    }
  }

  let result = 'import React from \'react\'\n'

  for (const [pkgName, data] of Object.entries(outputExportsMap)) {
    const defaultChunk = data.default ? `${data.default}, ` : ''
    result += `import ${defaultChunk}{ ${data.exports.join(', ')} } from '${pkgName}'\n`
  }

  result += `
export default () => (
${data.component}
)
`

  return result
}

const getWebSnapshot = (element: ReactElement<any>, exportsMap: TExportsMap) => {
  const serializedReactTree = serializeReactTree(element, 2)
  const serializedComponent = wrapComponent(serializedReactTree, exportsMap)

  return serializedComponent
}

export default getWebSnapshot
