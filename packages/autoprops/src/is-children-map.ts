import { isValidElement } from 'react'
import { isObject } from 'tsfn'
import { TChildrenMap } from './types'

export const isChildrenMap = (children: any): children is TChildrenMap =>
  isObject(children) && !isValidElement(children)
