import { ReactElement } from 'react'
import { TJsonValue } from 'typeon'

export type TItem = {
  id: string,
  element: ReactElement,
  meta: TJsonValue,
}

export type TCheckResult =
  {
    type: 'OK',
    id: string,
    path: string,
  } | {
    type: 'NEW' | 'DIFF',
    id: string,
    path: string,
    meta: TJsonValue,
    data: Buffer,
  }
