import type { TTransform } from '../types'
import type { TActionCreator, TState, TActionWithPayload, TAction } from './types'

export const TYPE_SET_SEARCH_VALUE = 'SET_SEARCH_VALUE'
export const TYPE_SET_WIDTH = 'SET_WIDTH'
export const TYPE_SET_HEIGHT = 'SET_HEIGHT'
export const TYPE_SET_RESOLUTION = 'SET_RESOLUTION'
export const TYPE_SET_TRANSFORM = 'SET_TRANSFORM'
export const TYPE_RESET_TRANSFORM = 'RESET_TRANSFORM'
export const TYPE_TOGGLE_GRID = 'TOGGLE_GRID'
export const TYPE_TOGGLE_STRETCH = 'TOGGLE_STRETCH'
export const TYPE_TOGGLE_INSPECT = 'TOGGLE_INSPECT'
export const TYPE_TOGGLE_CANVAS_DARK_MODE = 'TOGGLE_CANVAS_DARK_MODE'
export const TYPE_TOGGLE_NAVIGATION_SIDEBAR = 'TOGGLE_NAVIGATION_SIDEBAR'
export const TYPE_TOGGLE_CONTROLS_SIDEBAR = 'TOGGLE_CONTROLS_SIDEBAR'
export const TYPE_NAVIGATE = 'NAVIGATE'

export type TSetWidthAction = TActionWithPayload<typeof TYPE_SET_WIDTH, TState['width']>
export type TSetHeightAction = TActionWithPayload<typeof TYPE_SET_HEIGHT, TState['height']>
export type TToggleStretchAction = TAction<typeof TYPE_TOGGLE_STRETCH>
export type TToggleInspectAction = TAction<typeof TYPE_TOGGLE_INSPECT>
export type TToggleGridAction = TAction<typeof TYPE_TOGGLE_GRID>
export type TToggleCanvasDarkModeAction = TAction<typeof TYPE_TOGGLE_CANVAS_DARK_MODE>
export type TToggleNavigationSidebarAction = TAction<typeof TYPE_TOGGLE_NAVIGATION_SIDEBAR>
export type TToggleControlsSidebarAction = TAction<typeof TYPE_TOGGLE_CONTROLS_SIDEBAR>
export type TSetResolutionAction = TActionWithPayload<typeof TYPE_SET_RESOLUTION, TState['resolutionKey']>
export type TSetTransformAction = TActionWithPayload<typeof TYPE_SET_TRANSFORM, TTransform>
export type TResetTransformAction = TAction<typeof TYPE_RESET_TRANSFORM>
export type TNavigateAction = TActionWithPayload<typeof TYPE_NAVIGATE, Pick<TState, 'width' | 'height' | 'transformX' | 'transformY' | 'transformZ' | 'resolutionKey' | 'shouldStretch' | 'hasGrid' | 'isCanvasDarkMode'>>

export type TAllActions =
  TSetWidthAction |
  TSetHeightAction |
  TToggleStretchAction |
  TToggleInspectAction |
  TToggleGridAction |
  TToggleCanvasDarkModeAction |
  TToggleNavigationSidebarAction |
  TToggleControlsSidebarAction |
  TSetResolutionAction |
  TSetTransformAction |
  TResetTransformAction |
  TNavigateAction

export const setWidthAction = (payload: TSetWidthAction['payload']): TSetWidthAction => ({
  type: TYPE_SET_WIDTH,
  payload,
})

export const setHeightAction = (payload: TSetHeightAction['payload']): TSetHeightAction => ({
  type: TYPE_SET_HEIGHT,
  payload,
})

export const toggleNavigationSidebarAction: TActionCreator<TToggleNavigationSidebarAction> = () => ({
  type: TYPE_TOGGLE_NAVIGATION_SIDEBAR,
})

export const toggleControlsSidebarAction: TActionCreator<TToggleControlsSidebarAction> = () => ({
  type: TYPE_TOGGLE_CONTROLS_SIDEBAR,
})

export const toggleGridAction = (): TToggleGridAction => ({
  type: TYPE_TOGGLE_GRID,
})

export const toggleStretchAction = (): TToggleStretchAction => ({
  type: TYPE_TOGGLE_STRETCH,
})

export const toggleInspectAction = (): TToggleInspectAction => ({
  type: TYPE_TOGGLE_INSPECT,
})

export const toggleCanvasDarkModeAction = (): TToggleCanvasDarkModeAction => ({
  type: TYPE_TOGGLE_CANVAS_DARK_MODE,
})

export const setResolutionAction = (payload: TSetResolutionAction['payload']): TSetResolutionAction => ({
  type: TYPE_SET_RESOLUTION,
  payload,
})

export const setTransformAction = (payload: TSetTransformAction['payload']): TSetTransformAction => ({
  type: TYPE_SET_TRANSFORM,
  payload,
})

export const resetTransformAction: TActionCreator<TResetTransformAction> = () => ({
  type: TYPE_RESET_TRANSFORM,
})

export const navigateAction = (payload: TNavigateAction['payload']): TNavigateAction => ({
  type: TYPE_NAVIGATE,
  payload,
})
