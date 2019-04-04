import { ReactElement } from 'react'

export type TMessageStatus = 'ok' | 'diff' | 'new' | 'unknown'

export type TMessage = {
  status: TMessageStatus,
  path: string
}

export type TItem = {
  meta: {
    name: string,
    hasOwnWidth: boolean
  },
  element: ReactElement<any>
}

export type TCheckResult = {
  status: TMessageStatus,
  path: string
}

export type TTotalResult = {
  ok: number,
  diff: number,
  new: number
}
