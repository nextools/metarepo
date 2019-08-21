import { TAction, TAnyAction } from '../types'

const TYPE_LOADING_START = 'LOADING_START'
const TYPE_LOADING_END = 'LOADING_END'

export type TActionLoadingStart = TAction<typeof TYPE_LOADING_START>
export type TActionLoadingEnd = TAction<typeof TYPE_LOADING_END>

export const actionLoadingStart = (): TActionLoadingStart => ({ type: TYPE_LOADING_START })
export const actionLoadingEnd = (): TActionLoadingEnd => ({ type: TYPE_LOADING_END })

export const isActionLoadingStart = (obj: TAnyAction): obj is TActionLoadingStart => obj.type === TYPE_LOADING_START
export const isActionLoadingEnd = (obj: TAnyAction): obj is TActionLoadingEnd => obj.type === TYPE_LOADING_END
