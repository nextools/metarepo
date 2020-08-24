import { StoreContextFactory } from 'refun'
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

export * from './types'
