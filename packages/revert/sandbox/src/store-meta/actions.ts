import { getProps, isChildrenMap, createChildren, applyPropValue, applyValidPerm } from 'autoprops'
import type { TCommonComponentConfig } from 'autoprops'
import type { ThunkAction } from 'redux-thunk'
import type { TAnyObject, TExtend } from 'tsfn'
import type { TComponents } from '../types'
import { initialState } from './initial-state'
import type { TMetaState } from './types'
import { importMeta } from './utils/import-meta'
import { mutateHandlers } from './utils/mutate-handlers'

export const SET_COMPONENT_KEY_ACTION = 'SET_COMPONENT_KEY'
export const RESET_COMPONENT_KEY_ACTION = 'RESET_COMPONENT_KEY'
export const SET_COMPONENTS_LIST_ACTION = 'SET_COMPONENTS_LIST'
export const SET_IMPORTED_META_ACTION = 'SET_IMPORTED_META'
export const SET_PROPS_ACTION = 'SET_PROPS'
export const SELECT_ELEMENT_ACTION = 'SELECT_ELEMENT'

export type TAction<T extends string = string> = {
  type: T,
  payload?: TAnyObject,
}

type TActionCreator<A extends TAction> = () => A
type TActionWithPayload<T extends string, P extends TAnyObject> = TExtend<TAction<T>, { payload: P }>
type TActionAsync<A extends TAction = TAction> = ThunkAction<Promise<void>, TMetaState, undefined, A>

export type TSetComponentKeyAction = TActionWithPayload<typeof SET_COMPONENT_KEY_ACTION, Pick<TMetaState, 'componentKey' | 'propsIndex'>>
export type TSelectElementAction = TActionWithPayload<typeof SELECT_ELEMENT_ACTION, Pick<TMetaState, 'selectedElementPath'>>
export type TResetComponentKeyAction = TAction<typeof RESET_COMPONENT_KEY_ACTION>
export type TSetComponentsListAction = TActionWithPayload<typeof SET_COMPONENTS_LIST_ACTION, Pick<TMetaState, 'components'>>
export type TSetImportedMetaAction = TActionWithPayload<typeof SET_IMPORTED_META_ACTION, TMetaState>
export type TSetPropsAction = TActionWithPayload<typeof SET_PROPS_ACTION, Pick<TMetaState, 'componentProps' | 'componentPropsChildrenMap' | 'componentKey' | 'propsIndex'>>

export type TAllActions =
  TSetComponentKeyAction |
  TSelectElementAction |
  TResetComponentKeyAction |
  TSetComponentsListAction |
  TSetImportedMetaAction |
  TSetPropsAction

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
    const { Component, config, controls, packageJson } = await importMeta(components, componentKey)

    // Validate index
    const validIndex = applyValidPerm(config, propsIndex)
    const { props, propsChildrenMap } = loadComponentProps(config, validIndex)

    dispatch(setImportedMeta({
      components,
      Component,
      componentConfig: config,
      componentControls: controls ?? null,
      packageJson: packageJson ?? null,
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
