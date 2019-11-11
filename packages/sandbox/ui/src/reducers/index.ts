import { Reducer } from 'redux'
import { isUndefined } from 'tsfn'
import {
  isToggleStretchAction,
  isToggleInspectAction,
  isToggleGridAction,
  isToggleThemeAction,
  isSetWidthAction,
  isSetHeightAction,
  isSetComponentAction,
  isSetSelectedSetIndexAction,
  isNavigateAction,
  isSetResolutionAction,
  isToggleControlsAction,
  isSetTransformAction,
  isSelectElementAction,
} from '../actions'
import { TAction, TState } from '../types'
import { resolutions, findResolutionKey } from '../resolutions'
import { getInitialState } from '../store/get-initial-state'

export type TReducer<S extends {}> = (state: S, action: TAction<any>) => S

const filterWidth = (value: number) => Math.min(Math.max(value, 50), 10000)
const filterHeight = (value: number) => Math.min(Math.max(value, 50), 10000)
const filterZoom = (value: number) => Math.round(value * 100) / 100
const filterOffset = (value: number) => (Math.round(value * 100) / 100)

export const reducer: Reducer<TState> = (state, action): TState => {
  if (isUndefined(state)) {
    return getInitialState()
  }

  if (isSetWidthAction(action)) {
    return {
      ...state,
      width: filterWidth(action.payload),
      resolutionKey: findResolutionKey(action.payload, state.height),
    }
  }

  if (isSetHeightAction(action)) {
    return {
      ...state,
      height: filterHeight(action.payload),
      resolutionKey: findResolutionKey(state.width, action.payload),
    }
  }

  if (isSetComponentAction(action)) {
    return {
      ...state,
      componentKey: action.payload,
      selectedSetIndex: '0',
      selectedElementPath: '',
    }
  }

  if (isSetSelectedSetIndexAction(action)) {
    return {
      ...state,
      selectedSetIndex: action.payload,
    }
  }

  if (isSetResolutionAction(action)) {
    if (action.payload === null) {
      return {
        ...state,
        resolutionKey: action.payload,
      }
    }

    return {
      ...state,
      resolutionKey: action.payload,
      width: resolutions[action.payload].width,
      height: resolutions[action.payload].height,
    }
  }

  if (isSetTransformAction(action)) {
    return {
      ...state,
      transform: {
        x: filterOffset(action.payload.x),
        y: filterOffset(action.payload.y),
        z: filterZoom(action.payload.z),
      },
    }
  }

  if (isToggleControlsAction(action)) {
    return {
      ...state,
      isVisibleControls: !state.isVisibleControls,
    }
  }

  if (isToggleGridAction(action)) {
    return {
      ...state,
      hasGrid: !state.hasGrid,
    }
  }

  if (isToggleStretchAction(action)) {
    return {
      ...state,
      shouldStretch: !state.shouldStretch,
    }
  }

  if (isToggleInspectAction(action)) {
    return {
      ...state,
      shouldInspect: !state.shouldInspect,
    }
  }

  if (isToggleThemeAction(action)) {
    return {
      ...state,
      themeName: state.themeName === 'light' ? 'dark' : 'light',
    }
  }

  if (isNavigateAction(action)) {
    return {
      ...state,
      ...action.payload,
      width: filterWidth(action.payload.width),
      height: filterHeight(action.payload.height),
    }
  }

  if (isSelectElementAction(action)) {
    return {
      ...state,
      selectedElementPath: action.payload,
    }
  }

  return state
}
