import { TActionWithPayload, TAnyAction } from '../types'

const TYPE_REMOVE_FILTER = 'REMOVE_FILTER'

export type TActionRemoveFilter = TActionWithPayload<typeof TYPE_REMOVE_FILTER, string>

export const actionRemoveFilter = (payload: string): TActionRemoveFilter => ({
  type: TYPE_REMOVE_FILTER,
  payload,
})

export const isActionRemoveFilter = (obj: TAnyAction): obj is TActionRemoveFilter => obj.type === TYPE_REMOVE_FILTER
