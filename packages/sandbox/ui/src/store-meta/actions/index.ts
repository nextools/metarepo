import { ThunkAction } from 'redux-thunk'
import { isUndefined, TAnyObject, isDefined, TOmitKey, TExtend } from 'tsfn'
import { getProps, isChildrenMap, createChildren, TComponentConfig } from 'autoprops'
import { TComponents } from '../../types'
import { TMetaState } from '../types'
import { importMeta } from '../utils/import-meta'
import { mutateHandlers } from '../utils/mutate-handlers'

export const SET_COMPONENT_KEY_ACTION = 'SET_COMPONENT_KEY'
export const RESET_COMPONENT_KEY_ACTION = 'RESET_COMPONENT_KEY'
export const SET_COMPONENTS_LIST_ACTION = 'SET_COMPONENTS_LIST'
export const SET_IMPORTED_META_ACTION = 'SET_IMPORTED_META'
export const SET_PROPS_ACTION = 'SET_PROPS'

export type TAnyAction = {
  type: string,
  payload?: TAnyObject,
}

type TAction<T extends string> = TOmitKey<TExtend<TAnyAction, { type: T }>, 'payload'>
type TActionCreator<A extends TAnyAction> = () => A
type TActionWithPayload<T extends string, P extends TAnyObject> = TExtend<TAnyAction, { type: T, payload: P }>
type TActionWithPayloadCreator<A extends TAnyAction> = (payload: A['payload']) => A
type TActionAsync<A extends TAnyAction = TAnyAction> = ThunkAction<Promise<void>, TMetaState, undefined, A>

export type TSetComponentKeyAction = TActionWithPayload<typeof SET_COMPONENT_KEY_ACTION, { componentKey: string, propsIndex: string }>
export type TResetComponentKeyAction = TAction<typeof RESET_COMPONENT_KEY_ACTION>
export type TSetComponentsListAction = TActionWithPayload<typeof SET_COMPONENTS_LIST_ACTION, Pick<TMetaState, 'components'>>
export type TSetImportedMetaAction = TActionWithPayload<typeof SET_IMPORTED_META_ACTION, TMetaState>
export type TSetPropsAction = TActionWithPayload<typeof SET_PROPS_ACTION, Pick<TMetaState, 'componentProps' | 'componentPropsChildrenMap' | 'componentKey' | 'propsIndex'>>

export type TAllActions =
  TSetComponentKeyAction |
  TResetComponentKeyAction |
  TSetComponentsListAction |
  TSetImportedMetaAction |
  TSetPropsAction

const setComponentKeyAction: TActionWithPayloadCreator<TSetComponentKeyAction> = (payload) => ({
  type: SET_COMPONENT_KEY_ACTION,
  payload,
})

const resetComponentKeyAction: TActionCreator<TResetComponentKeyAction> = () => ({
  type: RESET_COMPONENT_KEY_ACTION,
})

const setComponentsListAction: TActionWithPayloadCreator<TSetComponentsListAction> = (payload) => ({
  type: SET_COMPONENTS_LIST_ACTION,
  payload,
})

const setImportedMeta: TActionWithPayloadCreator<TSetImportedMetaAction> = (payload) => ({
  type: SET_IMPORTED_META_ACTION,
  payload,
})

const setPropsAction: TActionWithPayloadCreator<TSetPropsAction> = (payload) => ({
  type: SET_PROPS_ACTION,
  payload,
})

const loadComponentProps = (componentConfig: TComponentConfig, propsIndex: string) => {
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
    const { Component, config, packageJson } = await importMeta(components, componentKey)

    const { props, propsChildrenMap } = loadComponentProps(config, propsIndex)

    dispatch(setImportedMeta({
      components,
      Component,
      componentConfig: config,
      packageJson,
      componentProps: props,
      componentPropsChildrenMap: propsChildrenMap,
      componentKey,
      propsIndex,
    }))
  }

export const setComponentListThunk = (components: TComponents): TActionAsync =>
  // eslint-disable-next-line require-await
  async (dispatch, getState) => {
    const { componentKey, propsIndex } = getState()

    if (componentKey !== null && isDefined(propsIndex)) {
      return dispatch(importMetaThunk(components, componentKey, propsIndex))
    }

    dispatch(setComponentsListAction({ components }))
  }

export const updateComponentPropsThunk = (componentKey: string | null, propsIndex: string): TActionAsync =>
  // eslint-disable-next-line require-await
  async (dispatch, getState) => {
    if (componentKey === null) {
      dispatch(resetComponentKeyAction())

      return
    }

    const { components, componentKey: prevComponentKey, componentConfig } = getState()

    if (isUndefined(components)) {
      dispatch(setComponentKeyAction({
        componentKey,
        propsIndex,
      }))

      return
    }

    if (prevComponentKey !== componentKey) {
      return dispatch(importMetaThunk(components, componentKey, propsIndex))
    }

    if (isUndefined(componentConfig)) {
      throw new Error('Cannot load props. State is invalid')
    }

    const { props, propsChildrenMap } = loadComponentProps(componentConfig, propsIndex)

    dispatch(setPropsAction({
      componentProps: props,
      componentPropsChildrenMap: propsChildrenMap,
      componentKey,
      propsIndex,
    }))
  }
