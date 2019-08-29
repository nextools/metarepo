import { TActionWithPayload, TAnyAction } from '../types'

const TYPE_DISCARD_ITEM = 'DISCARD_ITEM'

export type TActionDiscardItem = TActionWithPayload<typeof TYPE_DISCARD_ITEM, string>

export const actionDiscardItem = (payload: string): TActionDiscardItem => ({
  type: TYPE_DISCARD_ITEM,
  payload,
})

export const isActionDiscardItem = (obj: TAnyAction): obj is TActionDiscardItem => obj.type === TYPE_DISCARD_ITEM
