import { StoreContextFactory } from 'refun'
import { TTransform } from '../types'
import { store } from './store'
import { injectReducerFactory, storeSubscribeFactory } from './utils'
import { reducer } from './reducers'
import { navigateAction, resetTransformAction, setWidthAction, setHeightAction, selectElementAction, setResolutionAction, setComponentAction, setSelectedSetIndexAction, setTransformAction, toggleGridAction, toggleCanvasDarkModeAction, toggleControlsSidebarAction, toggleNavigationSidebarAction, toggleInspectAction, toggleStretchAction } from './actions'
import { TState } from './types'

const StoreContext = StoreContextFactory(store)

export const mapStoreState = StoreContext.mapStoreState

export const injectReducer = injectReducerFactory(store, reducer, StoreContext.Context)

export const storeSubscribe = storeSubscribeFactory(store)

export const navigate = (payload: TState) => {
  store.dispatch(navigateAction(payload))
}

export const resetTransform = () => {
  store.dispatch(resetTransformAction())
}

export const setWidth = (payload: TState['width']) => {
  store.dispatch(setWidthAction(payload))
}

export const setHeight = (payload: TState['height']) => {
  store.dispatch(setHeightAction(payload))
}

export const selectElement = (payload: TState['selectedElementPath']) => {
  store.dispatch(selectElementAction(payload))
}

export const setResolution = (payload: TState['resolutionKey']) => {
  store.dispatch(setResolutionAction(payload))
}

export const setComponent = (payload: TState['componentKey']) => {
  store.dispatch(setComponentAction(payload))
}

export const setSelectedSetIndex = (payload: TState['selectedSetIndex']) => {
  store.dispatch(setSelectedSetIndexAction(payload))
}

export const setTransform = (payload: TTransform) => {
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
