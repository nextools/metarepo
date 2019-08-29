import { ReactElement } from 'react'
import serializeReactTree from './serialize-react-tree'

export default (reactElement: ReactElement<any>): string => {
  return serializeReactTree(reactElement, 0)
}
