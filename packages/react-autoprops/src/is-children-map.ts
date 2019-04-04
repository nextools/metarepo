import { isValidElement } from 'react'
import { isObject, isUndefined, TAnyObject } from 'tsfn'
import { TChildrenMap } from './types'

export const isChildrenMap = (children: any): children is TChildrenMap => isObject(children) && !isValidElement(children)

export const hasChildren = (props: TAnyObject): props is TAnyObject & { children: any } =>
  !isUndefined(props['children'])
