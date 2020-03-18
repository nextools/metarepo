import { ReactElement } from 'react'
import { TAnyObject } from 'tsfn'

export type TItem = {
  id: string,
  element: ReactElement,
  meta: TAnyObject,
}

export type TCheckResult = {
  type: 'NEW' | 'OK' | 'DIFF',
  id: string,
  path: string,
  meta: TAnyObject,
  data: Buffer,
}
