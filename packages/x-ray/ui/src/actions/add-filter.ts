import { TActionWithPayload, TAnyAction } from '../types'

const TYPE_ADD_FILTER = 'ADD_FILTER'

export type TActionAddFilter = TActionWithPayload<typeof TYPE_ADD_FILTER, string>

export const actionAddFilter = (payload: string): TActionAddFilter => ({
  type: TYPE_ADD_FILTER,
  payload,
})

export const isActionAddFilter = (obj: TAnyAction): obj is TActionAddFilter => obj.type === TYPE_ADD_FILTER
