import { TAction, TAnyAction } from '../types'

const TYPE_ERROR = 'ERROR'

export type TActionError = TAction<typeof TYPE_ERROR>

export const actionError = (error: string): TActionError => ({ type: TYPE_ERROR, error })

export const isActionError = (obj: TAnyAction): obj is TActionError => obj.type === TYPE_ERROR
