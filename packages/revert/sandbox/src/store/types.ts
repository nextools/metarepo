import type { TCommonComponentConfig } from 'autoprops'
import type { FC } from 'react'
import type { AnyAction } from 'redux'
import type { ThunkAction, ThunkDispatch } from 'redux-thunk'
import type { TExtend, TAnyObject } from 'tsfn'
import type { TResolutionKey } from '../resolutions'
import type {
  TCommonComponentControls,
  TComponents,
  TPackageJson,
} from '../types'

export type TAction<T extends string = string> = {
  type: T,
  payload?: TAnyObject,
}

export type TActionCreator<A extends TAction> = () => A
export type TActionWithPayload<T extends string, P> = TExtend<TAction<T>, { payload: P }>
export type TActionAsync<A extends TAction = TAction> = ThunkAction<Promise<void>, TState, undefined, A>

export type TState = {
  width: number,
  height: number,
  hasGrid: boolean,
  shouldStretch: boolean,
  shouldInspect: boolean,
  isCanvasDarkMode: boolean,
  resolutionKey: TResolutionKey | null,
  isNavigationSidebarVisible: boolean,
  isControlsSidebarVisible: boolean,
  transformX: number,
  transformY: number,
  transformZ: number,
  // Meta State
  components: TComponents | null,
  // Key - Index group
  componentKey: string | null, // Key value
  propsIndex: string,
  selectedElementPath: string,
  // component group, depends on 'components' and 'componentKey'
  componentConfig: TCommonComponentConfig | null,
  componentControls: TCommonComponentControls | null,
  Component: FC<any> | null,
  componentProps: Readonly<TAnyObject>,
  componentPropsChildrenMap: Readonly<TAnyObject>,
  // packageJson group
  packageJson: TPackageJson | null,
  readme: string | null,
}

export type TDispatch = ThunkDispatch<TState, undefined, AnyAction>
