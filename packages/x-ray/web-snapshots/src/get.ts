import { ReactElement } from 'react'
import serializeReactTree from '@x-ray/serialize-react-tree'
import { TSerializedResult } from '@x-ray/serialize-react-tree/src/types'

const wrapComponent = (data: TSerializedResult) => `import React from 'react'

export default () => (
${data.component}
)
`

const getWebSnapshot = (element: ReactElement<any>) => {
  const serializedReactTree = serializeReactTree(element, 2)
  const serializedComponent = wrapComponent(serializedReactTree)

  return serializedComponent
}

export default getWebSnapshot
