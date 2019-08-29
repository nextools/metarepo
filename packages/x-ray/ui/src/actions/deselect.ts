import { TAnyAction, TAction } from '../types'

const TYPE_DESELECT = 'DESELECT'

export type TActionDeselect = TAction<typeof TYPE_DESELECT>

export const actionDeselect = (): TActionDeselect => ({
  type: TYPE_DESELECT,
})

export const isActionDeselect = (obj: TAnyAction): obj is TActionDeselect => obj.type === TYPE_DESELECT
