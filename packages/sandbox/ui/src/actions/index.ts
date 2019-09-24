import { TActionWithPayload, TActionWithPayloadCreator, TAction, TActionCreator, TState, TAnyAction } from '../types'

const SET_WIDTH = 'SET_WIDTH'
const SET_HEIGHT = 'SET_HEIGHT'
const SET_COMPONENT = 'SET_COMPONENT'
const SET_SELECTED_SET_INDEX = 'SET_SELECTED_SET_INDEX'
const SET_RESOLUTION = 'SET_RESOLUTION'
const SET_TRANSFORM = 'SET_TRANSFORM'
const TOGGLE_GRID = 'TOGGLE_GRID'
const TOGGLE_STRETCH = 'TOGGLE_STRETCH'
const TOGGLE_THEME = 'TOGGLE_THEME'
const TOGGLE_CONTROLS = 'TOGGLE_CONTROLS'
const NAVIGATE = 'NAVIGATE'
const SELECT_ELEMENT = 'SELECT_ELEMENT'

export type TSetWidthAction = TActionWithPayload<typeof SET_WIDTH, TState['width']>
export type TSetHeightAction = TActionWithPayload<typeof SET_HEIGHT, TState['height']>
export type TToggleStretchAction = TAction<typeof TOGGLE_STRETCH>
export type TToggleGridAction = TAction<typeof TOGGLE_GRID>
export type TToggleThemeAction = TAction<typeof TOGGLE_THEME>
export type TToggleControlsAction = TAction<typeof TOGGLE_CONTROLS>
export type TSetComponentAction = TActionWithPayload<typeof SET_COMPONENT, TState['componentKey']>
export type TSetSelectedSetIndexAction = TActionWithPayload<typeof SET_SELECTED_SET_INDEX, TState['selectedSetIndex']>
export type TSetResolutionAction = TActionWithPayload<typeof SET_RESOLUTION, TState['resolutionKey']>
export type TSetTransformAction = TActionWithPayload<typeof SET_TRANSFORM, TState['transform']>
export type TNavigateAction = TActionWithPayload<typeof NAVIGATE, TState>
export type TSelectElementAction = TActionWithPayload<typeof SELECT_ELEMENT, TState['selectedElementPath']>

export const setWidth: TActionWithPayloadCreator<TSetWidthAction> = (width) => ({
  type: SET_WIDTH,
  payload: width,
})

export const setHeight: TActionWithPayloadCreator<TSetHeightAction> = (height) => ({
  type: SET_HEIGHT,
  payload: height,
})

export const toggleControls: TActionCreator<TToggleControlsAction> = () => ({
  type: TOGGLE_CONTROLS,
})

export const toggleGrid: TActionCreator<TToggleGridAction> = () => ({
  type: TOGGLE_GRID,
})

export const toggleStretch: TActionCreator<TToggleStretchAction> = () => ({
  type: TOGGLE_STRETCH,
})

export const toggleTheme: TActionCreator<TToggleThemeAction> = () => ({
  type: TOGGLE_THEME,
})

export const setComponent: TActionWithPayloadCreator<TSetComponentAction> = (component) => ({
  type: SET_COMPONENT,
  payload: component,
})

export const setSelectedSetIndex: TActionWithPayloadCreator<TSetSelectedSetIndexAction> = (setIndex) => ({
  type: SET_SELECTED_SET_INDEX,
  payload: setIndex,
})

export const setResolution: TActionWithPayloadCreator<TSetResolutionAction> = (key) => ({
  type: SET_RESOLUTION,
  payload: key,
})

export const setTransform: TActionWithPayloadCreator<TSetTransformAction> = (value) => ({
  type: SET_TRANSFORM,
  payload: value,
})

export const navigate: TActionWithPayloadCreator<TNavigateAction> = (state) => ({
  type: NAVIGATE,
  payload: state,
})

export const selectElement: TActionWithPayloadCreator<TSelectElementAction> = (state) => ({
  type: SELECT_ELEMENT,
  payload: state,
})

export const isSetWidthAction = (obj: TAnyAction): obj is TSetWidthAction => obj.type === SET_WIDTH
export const isSetHeightAction = (obj: TAnyAction): obj is TSetHeightAction => obj.type === SET_HEIGHT
export const isSetComponentAction = (obj: TAnyAction): obj is TSetComponentAction => obj.type === SET_COMPONENT
export const isSetSelectedSetIndexAction = (obj: TAnyAction): obj is TSetSelectedSetIndexAction => obj.type === SET_SELECTED_SET_INDEX
export const isSetResolutionAction = (obj: TAnyAction): obj is TSetResolutionAction => obj.type === SET_RESOLUTION
export const isSetTransformAction = (obj: TAnyAction): obj is TSetTransformAction => obj.type === SET_TRANSFORM
export const isToggleControlsAction = (obj: TAnyAction): obj is TToggleControlsAction => obj.type === TOGGLE_CONTROLS
export const isToggleGridAction = (obj: TAnyAction): obj is TToggleGridAction => obj.type === TOGGLE_GRID
export const isToggleStretchAction = (obj: TAnyAction): obj is TToggleStretchAction => obj.type === TOGGLE_STRETCH
export const isToggleThemeAction = (obj: TAnyAction): obj is TToggleThemeAction => obj.type === TOGGLE_THEME
export const isNavigateAction = (obj: TAnyAction): obj is TNavigateAction => obj.type === NAVIGATE
export const isSelectElementAction = (obj: TAnyAction): obj is TSelectElementAction => obj.type === SELECT_ELEMENT
