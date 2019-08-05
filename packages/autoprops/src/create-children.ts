import { ReactElement, createElement } from 'react'
import { isUndefined, TAnyObject } from 'tsfn'
import { getBaseName } from './get-indexed-name'
import { TChildrenMap, TChildrenConfig } from './types'
import { isChildrenMap } from './is-children-map'

export const createChildren = (childrenConfig: TChildrenConfig, children: TChildrenMap): ReactElement | ReactElement[] => {
  const childrenKeys = Object.keys(children)
  const createdChildren: ReactElement[] = []

  for (let i = 0; i < childrenKeys.length; ++i) {
    const childIndexedKey = childrenKeys[i]
    const childKey = getBaseName(childIndexedKey)
    const childrenProps = children[childIndexedKey] as TAnyObject
    const childMeta = childrenConfig.meta[childKey]

    if (isChildrenMap(childrenProps.children)) {
      const { children, ...props } = childrenProps

      if (isUndefined(childMeta.childrenConfig)) {
        throw new Error(`Cannot get childrenConfig for ${childMeta.Component.displayName}`)
      }

      createdChildren.push(
        createElement(childMeta.Component, { ...props, key: i }, createChildren(childMeta.childrenConfig, children))
      )
    } else {
      createdChildren.push(
        createElement(childMeta.Component, { ...childrenProps, key: i })
      )
    }
  }

  if (createdChildren.length === 1) {
    return createdChildren[0]
  }

  return createdChildren
}
