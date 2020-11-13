import { decodeUrl, EMPTY_HASH, getCurrentHash } from '../utils'
import { initialState } from './initial-state'
import type { TState } from './types'

export const getHashInitialState = (): TState => {
  const hash = getCurrentHash()

  if (hash === EMPTY_HASH) {
    return initialState
  }

  const {
    Component,
    componentConfig,
    componentControls,
    componentKey,
    componentProps,
    componentPropsChildrenMap,
    components,
    hasGrid,
    height,
    isCanvasDarkMode,
    isControlsSidebarVisible,
    isNavigationSidebarVisible,
    packageJson,
    propsIndex,
    readme,
    resolutionKey,
    selectedElementPath,
    shouldInspect,
    shouldStretch,
    transformX,
    transformY,
    transformZ,
    width,
  } = {
    ...initialState,
    ...decodeUrl(hash),
  }

  return {
    Component,
    componentConfig,
    componentControls,
    componentKey,
    componentProps,
    componentPropsChildrenMap,
    components,
    hasGrid,
    height,
    isCanvasDarkMode,
    isControlsSidebarVisible,
    isNavigationSidebarVisible,
    packageJson,
    propsIndex,
    readme,
    resolutionKey,
    selectedElementPath,
    shouldInspect,
    shouldStretch,
    transformX,
    transformY,
    transformZ,
    width,
  }
}
