import type { Reducer } from 'redux'
import { isNumber, isUndefined } from 'tsfn'
import { resolutions, findResolutionKey } from '../resolutions'
import {
  TYPE_SET_WIDTH,
  TYPE_SET_HEIGHT,
  TYPE_SET_RESOLUTION,
  TYPE_SET_TRANSFORM,
  TYPE_TOGGLE_GRID,
  TYPE_TOGGLE_STRETCH,
  TYPE_TOGGLE_INSPECT,
  TYPE_TOGGLE_CANVAS_DARK_MODE,
  TYPE_NAVIGATE,
  TYPE_RESET_TRANSFORM,
  TYPE_TOGGLE_NAVIGATION_SIDEBAR,
  TYPE_TOGGLE_CONTROLS_SIDEBAR,
  SET_COMPONENTS_LIST_ACTION,
  SET_COMPONENT_KEY_ACTION,
  RESET_COMPONENT_KEY_ACTION,
  SELECT_ELEMENT_ACTION,
  SET_IMPORTED_META_ACTION,
  SET_PROPS_ACTION,
} from './actions'
import type { TAllActions } from './actions'
import { initialState } from './initial-state'
import type { TState } from './types'

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
      if (!isNumber(action.payload)) {
        return state
      }

      return {
        ...state,
        width: filterWidth(action.payload),
        resolutionKey: findResolutionKey(action.payload, state.height),
      }
    }

    case TYPE_SET_HEIGHT: {
      if (!isNumber(action.payload)) {
        return state
      }

      return {
        ...state,
        height: filterHeight(action.payload),
        resolutionKey: findResolutionKey(state.width, action.payload),
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
      const {
        hasGrid,
        isCanvasDarkMode,
        resolutionKey,
        shouldStretch,
        transformX,
        transformY,
        transformZ,
        width,
        height,
      } = action.payload

      return {
        ...state,
        hasGrid,
        isCanvasDarkMode,
        resolutionKey,
        shouldStretch,
        transformX,
        transformY,
        transformZ,
        width: filterWidth(width),
        height: filterHeight(height),
      }
    }

    case SET_COMPONENTS_LIST_ACTION: {
      const { components } = action.payload
      const {
        componentKey,
        propsIndex,
        selectedElementPath,
        componentConfig,
        componentControls,
        Component,
        componentProps,
        componentPropsChildrenMap,
        packageJson,
        readme,
      } = initialState

      return {
        ...state,
        componentKey,
        propsIndex,
        selectedElementPath,
        componentConfig,
        componentControls,
        Component,
        componentProps,
        componentPropsChildrenMap,
        packageJson,
        readme,
        components,
      }
    }

    case SET_COMPONENT_KEY_ACTION: {
      const { componentKey, propsIndex } = action.payload
      const {
        components,
        selectedElementPath,
        componentConfig,
        componentControls,
        Component,
        componentProps,
        componentPropsChildrenMap,
        packageJson,
        readme,
      } = initialState

      return {
        ...state,
        components,
        selectedElementPath,
        componentConfig,
        componentControls,
        Component,
        componentProps,
        componentPropsChildrenMap,
        packageJson,
        readme,
        componentKey,
        propsIndex,
      }
    }

    case RESET_COMPONENT_KEY_ACTION: {
      const {
        componentKey,
        propsIndex,
        selectedElementPath,
        componentConfig,
        componentControls,
        Component,
        componentProps,
        componentPropsChildrenMap,
        packageJson,
        readme,
      } = initialState

      return {
        ...state,
        componentKey,
        propsIndex,
        selectedElementPath,
        componentConfig,
        componentControls,
        Component,
        componentProps,
        componentPropsChildrenMap,
        packageJson,
        readme,
        components: state.components,
      }
    }

    case SELECT_ELEMENT_ACTION: {
      const { selectedElementPath } = action.payload

      return {
        ...state,
        selectedElementPath,
      }
    }

    case SET_IMPORTED_META_ACTION: {
      const {
        Component,
        componentConfig,
        componentControls,
        componentKey,
        componentProps,
        componentPropsChildrenMap,
        components,
        packageJson,
        readme,
        propsIndex,
        selectedElementPath,
      } = action.payload

      return {
        ...state,
        Component,
        componentConfig,
        componentControls,
        componentKey,
        componentProps,
        componentPropsChildrenMap,
        components,
        packageJson,
        readme,
        propsIndex,
        selectedElementPath,
      }
    }

    case SET_PROPS_ACTION: {
      const {
        componentKey,
        componentProps,
        componentPropsChildrenMap,
        propsIndex,
      } = action.payload

      return {
        ...state,
        componentKey,
        componentProps,
        componentPropsChildrenMap,
        propsIndex,
      }
    }

    default: {
      return state
    }
  }
}
