import type { TState, TActionWithPayload } from '../types'

export const ACTION_SET_FOO = 'SET_FOO'

export type TSetFooAction = TActionWithPayload<typeof ACTION_SET_FOO, TState['foo']>

export type TAllActions = TSetFooAction

export const setFooAction = (payload: string): TSetFooAction => ({
  type: ACTION_SET_FOO,
  payload,
})
