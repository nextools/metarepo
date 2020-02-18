import { AnyAction, Reducer } from 'redux'
import { isUndefined } from 'tsfn'
import { TConsoleState } from '../types'
import { LOG_ACTION, CLEAR_ACTION } from '../actions'
import { initialState } from '../initial-state'

export const reducer: Reducer<TConsoleState, AnyAction> = (state, action) => {
  if (isUndefined(state)) {
    return initialState
  }

  switch (action.type) {
    case LOG_ACTION: {
      return {
        lines: [...state.lines, action.payload],
      }
    }

    case CLEAR_ACTION: {
      return initialState
    }

    default: {
      return state
    }
  }
}
