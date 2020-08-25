import type { TAction, TAnyAction, TTypeVariants } from '../types'

const TYPE_TAB = 'TAB'

export type TActionTab = TAction<typeof TYPE_TAB>

export const actionTab = (tab: TTypeVariants): TActionTab => ({ type: TYPE_TAB, payload: tab })

export const isActionTab = (obj: TAnyAction): obj is TActionTab => obj.type === TYPE_TAB
