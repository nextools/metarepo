import { Reducer } from 'redux'
import { isUndefined } from 'tsfn'
import {
  isActionLoadingStart,
  isActionLoadingEnd,
  isActionError,
  isActionLoadList,
  isActionSave,
  isActionSelectSnapshot,
  isActionSelectScreenshot,
  isActionDeselect,
  isActionDiscardItem,
  isActionAddFilter,
  isActionRemoveFilter,
} from '../actions'
import { TAction, TState } from '../types'
import { initialState } from '../store/initial-state'
import { isActionUndiscardItem } from '../actions/undiscard'

export type TReducer<S extends {}> = (state: S, action: TAction<any>) => S

export const reducer: Reducer<TState> = (state, action) => {
  if (isUndefined(state)) {
    return initialState
  }

  if (isActionLoadingStart(action)) {
    return {
      ...state,
      isLoading: true,
    }
  }

  if (isActionLoadingEnd(action)) {
    return {
      ...state,
      isLoading: false,
    }
  }

  if (isActionError(action)) {
    // TODO: remove me
    console.error(action.error)

    return {
      ...state,
      error: action.error,
    }
  }

  if (isActionLoadList(action)) {
    if (action.payload.type === 'image') {
      return {
        ...state,
        selectedItem: null,
        discardedItems: [],
        type: 'image',
        files: action.payload.files,
        items: action.payload.items,
      }
    }

    if (action.payload.type === 'text') {
      return {
        ...state,
        selectedItem: null,
        discardedItems: [],
        type: 'text',
        files: action.payload.files,
        items: action.payload.items,
      }
    }
  }

  if (isActionSelectScreenshot(action) && state.type === 'image') {
    return {
      ...state,
      selectedItem: action.payload,
    }
  }

  if (isActionSelectSnapshot(action) && state.type === 'text') {
    return {
      ...state,
      selectedItem: action.payload,
    }
  }

  if (isActionDeselect(action)) {
    return {
      ...state,
      selectedItem: null,
    }
  }

  if (isActionDiscardItem(action)) {
    if (state.discardedItems.includes(action.payload)) {
      return state
    }

    return {
      ...state,
      discardedItems: state.discardedItems.concat(action.payload),
    }
  }

  if (isActionUndiscardItem(action)) {
    if (!state.discardedItems.includes(action.payload)) {
      return state
    }

    return {
      ...state,
      discardedItems: state.discardedItems.filter((item) => item !== action.payload),
    }
  }

  if (isActionAddFilter(action)) {
    if (state.filteredFiles.includes(action.payload)) {
      return state
    }

    return {
      ...state,
      filteredFiles: state.filteredFiles.concat(action.payload),
    }
  }

  if (isActionRemoveFilter(action)) {
    if (!state.filteredFiles.includes(action.payload)) {
      return state
    }

    return {
      ...state,
      filteredFiles: state.filteredFiles.filter((item) => item !== action.payload),
    }
  }

  if (isActionSave(action)) {
    return {
      ...state,
      isSaved: true,
      discardedItems: [],
    }
  }

  return state
}
