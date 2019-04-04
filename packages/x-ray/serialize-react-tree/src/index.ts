import { ReactElement } from 'react'
import serializeReactTree from './serialize-react-tree'
import { TSerializedResult } from './types'

export * from './types'

export default (reactElement: ReactElement<any>, indent: number = 0): TSerializedResult => {
  const primitives: string[] = []
  const component = serializeReactTree(reactElement, indent, primitives)

  return {
    component,
    primitives,
  }
}
