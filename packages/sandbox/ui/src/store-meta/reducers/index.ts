import { Reducer } from 'redux'
import { isUndefined } from 'tsfn'
import { TMetaState } from '../types'
import { SET_COMPONENT_KEY_ACTION, SET_COMPONENTS_LIST_ACTION, SET_IMPORTED_META_ACTION, SET_PROPS_ACTION, RESET_COMPONENT_KEY_ACTION, TAllActions } from '../actions'
import { initialState } from '../initial-state'

export const reducer: Reducer<TMetaState, TAllActions> = (state, action) => {
  if (isUndefined(state)) {
    return initialState
  }

  switch (action.type) {
    case SET_COMPONENTS_LIST_ACTION: {
      const { components } = action.payload

      return {
        components,
        componentKey: null,
      }
    }

    case SET_COMPONENT_KEY_ACTION: {
      const { componentKey, propsIndex } = action.payload

      return {
        componentKey,
        propsIndex,
      }
    }

    case RESET_COMPONENT_KEY_ACTION: {
      return {
        components: state.components,
        componentKey: null,
      }
    }

    case SET_IMPORTED_META_ACTION: {
      return {
        ...action.payload,
      }
    }

    case SET_PROPS_ACTION: {
      return {
        ...state,
        ...action.payload,
      }
    }

    default: {
      return state
    }
  }
}
