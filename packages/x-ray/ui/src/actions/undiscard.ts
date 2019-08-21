import { TActionWithPayload, TAnyAction } from '../types'

const TYPE_UNDISCARD_ITEM = 'UNDISCARD_ITEM'

export type TActionUndiscardItem = TActionWithPayload<typeof TYPE_UNDISCARD_ITEM, string>

export const actionUndiscardItem = (payload: string): TActionUndiscardItem => ({
  type: TYPE_UNDISCARD_ITEM,
  payload,
})

export const isActionUndiscardItem = (obj: TAnyAction): obj is TActionUndiscardItem => obj.type === TYPE_UNDISCARD_ITEM
