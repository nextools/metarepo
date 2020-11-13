import { StoreContextFactory } from 'refun'
import type { TComponents } from '../types'
import {
  navigateAction,
  resetTransformAction,
  setWidthAction,
  setHeightAction,
  setResolutionAction,
  setTransformAction,
  toggleGridAction,
  toggleCanvasDarkModeAction,
  toggleControlsSidebarAction,
  toggleNavigationSidebarAction,
  toggleInspectAction,
  toggleStretchAction,
  setComponentListThunk,
  updateComponentPropsThunk,
  setComponentThunk,
  applyPropPathValue,
  selectElementAction,
} from './actions'
import type {
  TNavigateAction,
  TSetWidthAction,
  TSetHeightAction,
  TSetResolutionAction,
  TSetTransformAction,
} from './actions'
import { reducer } from './reducers'
import { store } from './store'
import type { TState } from './types'
import { injectReducerFactory } from './utils'

const StoreContext = StoreContextFactory(store)

export const mapStoreState = StoreContext.mapStoreState

export const injectReducer = injectReducerFactory(store, reducer, StoreContext.Context)

export const navigate = (payload: TNavigateAction['payload']) => {
  store.dispatch(navigateAction(payload))
}

export const resetTransform = () => {
  store.dispatch(resetTransformAction())
}

export const setWidth = (payload: TSetWidthAction['payload']) => {
  store.dispatch(setWidthAction(payload))
}

export const setHeight = (payload: TSetHeightAction['payload']) => {
  store.dispatch(setHeightAction(payload))
}

export const setResolution = (payload: TSetResolutionAction['payload']) => {
  store.dispatch(setResolutionAction(payload))
}

export const setTransform = (payload: TSetTransformAction['payload']) => {
  store.dispatch(setTransformAction(payload))
}

export const toggleGrid = () => {
  store.dispatch(toggleGridAction())
}

export const toggleCanvasDarkMode = () => {
  store.dispatch(toggleCanvasDarkModeAction())
}

export const toggleControlsSidebar = () => {
  store.dispatch(toggleControlsSidebarAction())
}

export const toggleNavigationSidebar = () => {
  store.dispatch(toggleNavigationSidebarAction())
}

export const toggleInspect = () => {
  store.dispatch(toggleInspectAction())
}

export const toggleStretch = () => {
  store.dispatch(toggleStretchAction())
}

// Meta Actions
export const setComponentsList = (components: TComponents) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  store.dispatch(setComponentListThunk(components))
}

export const updateComponentProps = (componentKey: string | null, propsIndex: string): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  return store.dispatch(updateComponentPropsThunk(componentKey, propsIndex))
}

export const setComponentKey = (componentKey: string) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  store.dispatch(setComponentThunk(componentKey))
}

export const applyPropValue = (propPath: string[], propValue: any) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  store.dispatch(applyPropPathValue(propPath, propValue))
}

export const selectElement = (payload: TState['selectedElementPath']) => {
  store.dispatch(selectElementAction({ selectedElementPath: payload }))
}

export type {
  TAction,
  TActionCreator,
  TActionWithPayload,
  TState,
} from './types'
