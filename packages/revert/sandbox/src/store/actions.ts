import type { TCommonComponentConfig } from 'autoprops'
import { applyPropValue, applyValidPerm, getProps, createChildren, isChildrenMap } from 'autoprops'
import type { TComponents, TTransform } from '../types'
import { initialState } from './initial-state'
import type { TActionCreator, TState, TActionWithPayload, TAction, TActionAsync } from './types'
import { importMeta } from './utils/import-meta'
import { mutateHandlers } from './utils/mutate-handlers'

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
// Meta Actions
export const SET_COMPONENT_KEY_ACTION = 'SET_COMPONENT_KEY'
export const RESET_COMPONENT_KEY_ACTION = 'RESET_COMPONENT_KEY'
export const SET_COMPONENTS_LIST_ACTION = 'SET_COMPONENTS_LIST'
export const SET_IMPORTED_META_ACTION = 'SET_IMPORTED_META'
export const SET_PROPS_ACTION = 'SET_PROPS'
export const SELECT_ELEMENT_ACTION = 'SELECT_ELEMENT'

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
// Meta Actions
export type TSetComponentKeyAction = TActionWithPayload<typeof SET_COMPONENT_KEY_ACTION, Pick<TState, 'componentKey' | 'propsIndex'>>
export type TSelectElementAction = TActionWithPayload<typeof SELECT_ELEMENT_ACTION, Pick<TState, 'selectedElementPath'>>
export type TResetComponentKeyAction = TAction<typeof RESET_COMPONENT_KEY_ACTION>
export type TSetComponentsListAction = TActionWithPayload<typeof SET_COMPONENTS_LIST_ACTION, Pick<TState, 'components'>>
export type TSetImportedMetaAction = TActionWithPayload<typeof SET_IMPORTED_META_ACTION, Pick<TState, 'components' | 'componentKey' | 'propsIndex' | 'selectedElementPath' | 'componentConfig' | 'componentControls' | 'Component' | 'componentProps' | 'componentPropsChildrenMap' | 'packageJson' | 'readme'>>
export type TSetPropsAction = TActionWithPayload<typeof SET_PROPS_ACTION, Pick<TState, 'componentProps' | 'componentPropsChildrenMap' | 'componentKey' | 'propsIndex'>>

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
  TNavigateAction |
  // Meta Actions
  TSetComponentKeyAction |
  TSelectElementAction |
  TResetComponentKeyAction |
  TSetComponentsListAction |
  TSetImportedMetaAction |
  TSetPropsAction

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

// META ACTIONS
const setComponentKeyAction = (payload: TSetComponentKeyAction['payload']): TSetComponentKeyAction => ({
  type: SET_COMPONENT_KEY_ACTION,
  payload,
})

export const selectElementAction = (payload: TSelectElementAction['payload']): TSelectElementAction => ({
  type: SELECT_ELEMENT_ACTION,
  payload,
})

const resetComponentKeyAction: TActionCreator<TResetComponentKeyAction> = () => ({
  type: RESET_COMPONENT_KEY_ACTION,
})

const setComponentsListAction = (payload: TSetComponentsListAction['payload']): TSetComponentsListAction => ({
  type: SET_COMPONENTS_LIST_ACTION,
  payload,
})

const setImportedMeta = (payload: TSetImportedMetaAction['payload']): TSetImportedMetaAction => ({
  type: SET_IMPORTED_META_ACTION,
  payload,
})

const setPropsAction = (payload: TSetPropsAction['payload']): TSetPropsAction => ({
  type: SET_PROPS_ACTION,
  payload,
})

const loadComponentProps = (componentConfig: TCommonComponentConfig, propsIndex: string) => {
  const propsChildrenMap = getProps(componentConfig, propsIndex)

  mutateHandlers(propsChildrenMap, '', componentConfig)

  const props = isChildrenMap(propsChildrenMap.children)
    ? {
      ...propsChildrenMap,
      children: createChildren(componentConfig, propsChildrenMap.children),
    }
    : propsChildrenMap

  return {
    props,
    propsChildrenMap,
  }
}

const importMetaThunk = (components: TComponents, componentKey: string, propsIndex: string): TActionAsync =>
  async (dispatch) => {
    const { Component, config, controls, packageJson, readme } = await importMeta(components, componentKey)

    // Validate index
    const validIndex = applyValidPerm(config, propsIndex)
    const { props, propsChildrenMap } = loadComponentProps(config, validIndex)

    dispatch(setImportedMeta({
      components,
      Component,
      componentConfig: config,
      componentControls: controls ?? null,
      packageJson: packageJson ?? null,
      readme: readme ?? null,
      componentProps: props,
      componentPropsChildrenMap: propsChildrenMap,
      componentKey,
      propsIndex: validIndex,
      selectedElementPath: '',
    }))
  }

export const setComponentListThunk = (components: TComponents): TActionAsync =>
  // eslint-disable-next-line require-await
  async (dispatch, getState) => {
    const { componentKey, propsIndex } = getState()

    if (componentKey !== null) {
      return dispatch(importMetaThunk(components, componentKey, propsIndex))
    }

    dispatch(setComponentsListAction({ components }))
  }

export const updateComponentPropsThunk = (componentKey: string | null, propsIndex: string): TActionAsync =>
  async (dispatch, getState) => {
    if (componentKey === null) {
      dispatch(resetComponentKeyAction())

      return
    }

    const { components, componentKey: prevComponentKey, componentConfig } = getState()

    // Check if component list was not yet loaded
    if (components === null) {
      dispatch(setComponentKeyAction({
        componentKey,
        propsIndex,
      }))

      return
    }

    // Component list is loaded
    // Check if component key has changed
    if (prevComponentKey !== componentKey) {
      await dispatch(
        importMetaThunk(components, componentKey, propsIndex)
      )

      return
    }

    if (componentConfig === null) {
      throw new Error('Cannot load props. State is invalid')
    }

    // Validate index
    const nextValidIndex = applyValidPerm(componentConfig, propsIndex)
    // Generate props
    const { props, propsChildrenMap } = loadComponentProps(componentConfig, nextValidIndex)

    dispatch(setPropsAction({
      componentKey,
      propsIndex: nextValidIndex,
      componentProps: props,
      componentPropsChildrenMap: propsChildrenMap,
    }))
  }

export const setComponentThunk = (componentKey: string): TActionAsync =>
  updateComponentPropsThunk(componentKey, initialState.propsIndex)

export const applyPropPathValue = (propPath: string[], propValue: any): TActionAsync =>
  // eslint-disable-next-line require-await
  async (dispatch, getState) => {
    const { componentConfig, propsIndex: prevIndex, componentKey } = getState()

    if (componentConfig === null || componentKey === null) {
      throw new Error('Cannot apply props. State is invalid')
    }

    const nextIndex = applyPropValue(componentConfig, prevIndex, propPath, propValue)

    const { props, propsChildrenMap } = loadComponentProps(componentConfig, nextIndex)

    dispatch(setPropsAction({
      componentKey,
      propsIndex: nextIndex,
      componentProps: props,
      componentPropsChildrenMap: propsChildrenMap,
    }))
  }
