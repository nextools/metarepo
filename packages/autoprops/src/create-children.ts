import { ReactElement, createElement } from 'react'
import { isUndefined, TAnyObject } from 'tsfn'
import { TChildrenMap, TComponentConfig } from './types'
import { isChildrenMap } from './is-children-map'
import { getChildrenKeys } from './get-keys'

export const createChildren = <ChildrenKeys extends string>(componentConfig: TComponentConfig<any, ChildrenKeys>, childrenMap: TChildrenMap<ChildrenKeys>): ReactElement | ReactElement[] => {
  const childrenConfig = componentConfig.children

  if (isUndefined(childrenConfig)) {
    throw new Error('Cannot get childrenConfig')
  }

  const createdChildren: ReactElement[] = []
  const childrenKeys = getChildrenKeys(componentConfig)

  for (let i = 0; i < childrenKeys.length; ++i) {
    const childKey = childrenKeys[i]
    const childrenProps = childrenMap[childKey]
    const childMeta = childrenConfig[childKey]

    if (isUndefined(childrenProps)) {
      continue
    }

    if (isChildrenMap(childrenProps.children)) {
      if (isUndefined(childMeta.config.children)) {
        throw new Error(`Cannot get childrenConfig for ${childMeta.Component.displayName}`)
      }

      const { children, ...props } = childrenProps as TAnyObject

      createdChildren.push(
        createElement(childMeta.Component, { ...props, key: i }, createChildren(childMeta.config, children))
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
