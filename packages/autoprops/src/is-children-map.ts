import { isValidElement } from 'react'
import { isObject } from 'tsfn'
import type { TChildrenMap } from './types'

export const isChildrenMap = (children: any): children is TChildrenMap => isObject(children) && !isValidElement(children)
