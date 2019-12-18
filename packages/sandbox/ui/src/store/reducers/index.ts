import { Reducer } from 'redux'
import { isUndefined } from 'tsfn'
import { TState } from '../types'
import { resolutions, findResolutionKey } from '../../resolutions'
import {
  TAllActions,
  TYPE_SET_WIDTH,
  TYPE_SET_HEIGHT,
  TYPE_SET_COMPONENT,
  TYPE_SET_SELECTED_SET_INDEX,
  TYPE_SET_RESOLUTION,
  TYPE_SET_TRANSFORM,
  TYPE_TOGGLE_GRID,
  TYPE_TOGGLE_STRETCH,
  TYPE_TOGGLE_INSPECT,
  TYPE_TOGGLE_CANVAS_DARK_MODE,
  TYPE_NAVIGATE,
  TYPE_SELECT_ELEMENT,
  TYPE_RESET_TRANSFORM,
  TYPE_TOGGLE_NAVIGATION_SIDEBAR,
  TYPE_TOGGLE_CONTROLS_SIDEBAR,
} from '../actions'
import { initialState } from '../initial-state'

const filterWidth = (value: number) => Math.min(Math.max(value, 50), 10000)
const filterHeight = (value: number) => Math.min(Math.max(value, 50), 10000)
const filterZoom = (value: number) => Math.round(value * 100) / 100
const filterOffset = (value: number) => (Math.round(value * 100) / 100)

export const reducer: Reducer<TState, TAllActions> = (state, action): TState => {
  if (isUndefined(state)) {
    return initialState
  }

  switch (action.type) {
    case TYPE_SET_WIDTH: {
      return {
        ...state,
        width: filterWidth(action.payload),
        resolutionKey: findResolutionKey(action.payload, state.height),
      }
    }

    case TYPE_SET_HEIGHT: {
      return {
        ...state,
        height: filterHeight(action.payload),
        resolutionKey: findResolutionKey(state.width, action.payload),
      }
    }

    case TYPE_SET_COMPONENT: {
      return {
        ...state,
        componentKey: action.payload,
        selectedSetIndex: '0',
        selectedElementPath: '',
      }
    }

    case TYPE_SET_SELECTED_SET_INDEX: {
      return {
        ...state,
        selectedSetIndex: action.payload,
      }
    }

    case TYPE_SET_RESOLUTION: {
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

    case TYPE_SET_TRANSFORM: {
      return {
        ...state,
        transformX: filterOffset(action.payload.x),
        transformY: filterOffset(action.payload.y),
        transformZ: filterZoom(action.payload.z),
      }
    }

    case TYPE_RESET_TRANSFORM: {
      const { transformX, transformY, transformZ } = initialState

      return {
        ...state,
        transformX,
        transformY,
        transformZ,
      }
    }

    case TYPE_TOGGLE_NAVIGATION_SIDEBAR: {
      return {
        ...state,
        isNavigationSidebarVisible: !state.isNavigationSidebarVisible,
      }
    }

    case TYPE_TOGGLE_CONTROLS_SIDEBAR: {
      return {
        ...state,
        isControlsSidebarVisible: !state.isControlsSidebarVisible,
      }
    }

    case TYPE_TOGGLE_GRID: {
      return {
        ...state,
        hasGrid: !state.hasGrid,
      }
    }

    case TYPE_TOGGLE_STRETCH: {
      return {
        ...state,
        shouldStretch: !state.shouldStretch,
      }
    }

    case TYPE_TOGGLE_INSPECT: {
      return {
        ...state,
        shouldInspect: !state.shouldInspect,
      }
    }

    case TYPE_TOGGLE_CANVAS_DARK_MODE: {
      return {
        ...state,
        isCanvasDarkMode: !state.isCanvasDarkMode,
      }
    }

    case TYPE_NAVIGATE: {
      return {
        ...state,
        ...action.payload,
        width: filterWidth(action.payload.width),
        height: filterHeight(action.payload.height),
      }
    }

    case TYPE_SELECT_ELEMENT: {
      return {
        ...state,
        selectedElementPath: action.payload,
      }
    }

    default: {
      return state
    }
  }
}
