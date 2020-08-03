import type { TActionWithPayload, TAnyAction } from '../types'

const TYPE_RESET_FILTER = 'RESET_FILTER'

export type TActionResetFilter = TActionWithPayload<typeof TYPE_RESET_FILTER, string>

export const actionResetFilter = (): TActionResetFilter => ({
  type: TYPE_RESET_FILTER,
  payload: '',
})

export const isActionResetFilter = (obj: TAnyAction): obj is TActionResetFilter => obj.type === TYPE_RESET_FILTER
