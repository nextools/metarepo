import type { Reducer } from 'redux'
import { isUndefined } from 'tsfn'
import { ACTION_SET_FOO } from '../actions'
import type { TAllActions } from '../actions'
import { initialState } from '../store/initial-state'
import type { TState } from '../types'

export const reducer: Reducer<TState, TAllActions> = (state, action): TState => {
  if (isUndefined(state)) {
    return initialState
  }

  switch (action.type) {
    case ACTION_SET_FOO: {
      return {
        foo: `${state.foo} ${action.payload}`,
      }
    }

    default: {
      return state
    }
  }
}
