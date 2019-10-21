import { isObject } from 'tsfn'
import { isValidElement } from 'react'
import { TChildrenMap } from './types'

export const isChildrenMap = (children: any): children is TChildrenMap =>
  isObject(children) && !isValidElement(children)
